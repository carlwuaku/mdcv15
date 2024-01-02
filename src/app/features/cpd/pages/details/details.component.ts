import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CpdObject } from '../../models/cpd_model';
import { CpdAttendanceObject } from '../../models/cpd_attendance_model';
import { CpdSessionObject } from '../../models/cpd_session_model';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TitleService } from 'src/app/core/services/title/title.service';
import { API_ADMIN_PATH, API_CPD_PATH } from 'src/app/shared/utils/constants';
import { PractitionerObject, PractitionerTypes } from 'src/app/features/practitioners/models/practitioner_model';
import { take } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  id: string;
  can_view: boolean = false;
  can_edit: boolean = false;
  can_delete: boolean = true;
  error: boolean = false
  is_loading: boolean = true;
  is_loaded: boolean = false;

  error_attendees: boolean = false
  is_loading_attendees: boolean = true;
  is_loaded_attendees: boolean = false;
  cpd!: CpdObject;
  attendees: CpdAttendanceObject[] = [];
  all_attendees: CpdAttendanceObject[] = [];
  attendance_date: string = "";
  show_pics: boolean = false;
  current_session!: CpdSessionObject | null;
  selected: CpdAttendanceObject[] = []

  //MIGRATION
  migration_cpd: any = null;
  migration_venue: any = "";
  migration_date: any = '';

  add_by = "manually";
  filename!: string;
  excel_col = 1;


  type:PractitionerTypes = PractitionerTypes.Doctors
  //if we want to view only doctors or pa's or all
  view_type = "All";

  constructor(private dbService: HttpService,
    private notify: NotifyService, private router: Router
    , private authService: AuthService, ar: ActivatedRoute, private titleService: TitleService) {
    this.id = ar.snapshot.params['id'];
    if (this.authService.currentUser?.permissions.includes("Cpd.Attendance.Create")) {
      this.can_edit = true;
      //this.goBack();
    }

    if (this.authService.currentUser?.permissions.includes("Cpd.Attendance.Delete")) {
      this.can_delete = true;
      //this.goBack();
    }
    this.titleService.setTitle("CPD");

  }

  ngOnInit() {
    this.getCpdDetails();
  }

  changeView(type: "All" | "Doctor" | "Physician Assistant") {
    this.view_type = type;
    if (type == 'All') {
      this.attendees = this.all_attendees
    }
    else {
      this.attendees = this.all_attendees.filter(function (item) {
        return item.type == type
      })
    }

  }

  getCpdDetails() {
    //load the cpd details and then attendees
    this.is_loading = true;
    this.dbService.get<any>(`${API_CPD_PATH}/getCpdById/${this.id}`)
      .pipe(take(1)).subscribe({
        next: (data) => {
          this.cpd = data.data;
          this.error = false;
          this.is_loaded = true;

        }, error: (error) => {
          this.error = true;
          this.is_loaded = false;
        },
        complete: () => {
          this.is_loading = false;
        }
      });
  }

  getAttendees() {
    this.is_loading_attendees = true;
    this.is_loaded_attendees = false;
    this.error_attendees = false;
    this.dbService.get<any>(`${API_CPD_PATH}/getCpdAttendees/${this.id}`)
      .pipe(take(1)).subscribe({
        next: data => {
          this.attendees = this.all_attendees = data.data;
          this.is_loading_attendees = false;
          this.is_loaded_attendees = true;
          this.error_attendees = false;

        }, error: error => {
          this.is_loading_attendees = false;
          this.error_attendees = true;
          this.is_loaded_attendees = false;
        }
      });
  }

  addAttendee(args: PractitionerObject) {
    if (this.current_session!.date == "") {
      this.notify.failNotification("Please make sure the selected session has a vaild date");
      return;
    }
    this.notify.showLoading();
    let data = new FormData();
    data.append("cpd_id", this.id);
    data.append("topic", this.cpd.topic);
    data.append("reg_num", args.registration_number);
    data.append("attendance_date", this.current_session!.date);
    data.append("cpd_session_id", this.current_session!.id);
    data.append("venue", this.current_session!.venue);
    this.dbService.post<any>(`${API_CPD_PATH}/addCpdAttendee`, data)
      .pipe(take(1)).subscribe({
        next: data => {
          this.notify.successNotification("Added successfully");
          this.getAttendees();
        },
        error: error => {
        },
        complete: () => {
          this.notify.hideLoading();

        }
      });
  }


  sessionSelected(args: CpdSessionObject) {
    this.current_session = args;
  }

  delete(h: CpdAttendanceObject) {
    if (window.confirm("Sure you want to delete this cpd attendance?")) {
      let data = new FormData();

      data.append("id", h.id);
      data.append("reg_num", h.lic_num);
      data.append("cpd_id", this.id)
      this.dbService.post<any>(`${API_CPD_PATH}/deleteCpdAttendance`, data,)
        .pipe(take(1)).subscribe({
          next: data => {
            if (data.status === "1") {
              this.attendees.splice(this.attendees.indexOf(h), 1);
              this.notify.successNotification("cpd attendance deleted successfully for " + h.lic_num);
            }
          }
        });
    }
  }


  delete_multiple() {
    if (window.confirm("Sure you want to delete the selected items?")) {
      this.notify.showLoading();
      const ids: string[] = []
      const reg_nums: string[] = []
      this.selected.map(p => {
        ids.push(p.id);
        reg_nums.push(p.lic_num)
      });

      const data = new FormData();

      data.append("id", ids.toString());
      data.append("reg_num", reg_nums.toString());
      data.append("cpd_id", this.id)
      this.dbService.post<any>(`${API_CPD_PATH}/deleteCpdAttendance`, data)
        .pipe(take(1)).subscribe({
          next: data => {
            this.getAttendees();
            this.selected = [];
            this.notify.successNotification("cpd attendance deleted successfully");
          }, error: error => {
            this.notify.hideLoading();
          }
        });
    }

  }

  setMigrationCpd(args:CpdObject) {
    this.migration_cpd = args;
  }

  migrateSelected() {
    if (window.confirm("Sure you want to move the selected items to a new topic?")) {
      this.notify.showLoading();
      const ids: string[] = []
      const reg_nums: string[] = []
      this.selected.map(p => {
        ids.push(p.id);
        reg_nums.push(p.lic_num)
      });

      const data = new FormData();

      data.append("id", ids.toString());
      data.append("reg_num", reg_nums.toString());
      data.append("cpd_id", this.migration_cpd.id);
      data.append("old_topic", this.cpd.topic);
      data.append("topic", this.migration_cpd.topic);
      data.append("venue", this.migration_venue);
      data.append("attendance_date", this.migration_date);
      this.dbService.post<any>(`${API_CPD_PATH}/updateCpdAttendance`, data)
        .pipe(take(1)).subscribe({
          next: data => {
            this.getAttendees();
            this.selected = [];
            this.notify.successNotification("cpd attendance moved successfully");


          },
          error: error => {
            this.notify.hideLoading();

          }
        });
    }

    // $("#migrate_cpd_attendees_modal").modal("hide")

  }

  uploadFile(event: any) {
    let fileList: FileList = event.target.files;
    //check the col we need to look in.
    if (this.excel_col == null || this.excel_col == undefined) {
      this.notify.failNotification("Please enter the column which contains the registration numbers");
      return;
    }
    if (fileList.length > 0) {
      let file: File = fileList[0];



      this.notify.showLoading();
      const data = new FormData();
      data.append("uploadFile", file);
      data.append("attendance_date", this.current_session!.date);
      data.append("venue", this.current_session!.venue);
      data.append("cpd_id", this.id);
      data.append("column", this.excel_col.toString());

      this.dbService.post<any>(`${API_CPD_PATH}/uploadAttendanceList`, data).pipe(take(1)).subscribe({
        next: (data) => {
          if (data.status === "1") {
            this.notify.successNotification("Uploaded successfully. ")
            this.filename = "";
          }
          this.notify.hideLoading()
        },
        error: error => {
          this.filename = "";
          console.log(error); alert("Unable to send file. Please try again");
          this.notify.hideLoading()
        }
      });

    }
  }

  getSearchUrl(): string{
    return `${API_ADMIN_PATH}/search?type=${this.type}`
  }

}
