import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { TitleService } from 'src/app/core/services/title/title.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { API_CPD_PATH } from 'src/app/shared/utils/constants';
import { AddCpdFacilityComponent } from '../../components/add-cpd-facility/add-cpd-facility.component';
import { CpdFacilityObject } from '../../models/cpd_facility_model';
import { CpdObject } from '../../models/cpd_model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  facilities!: CpdFacilityObject[];
  cpd: CpdObject = {
    topic: '',
    credits: '',
    attendance_date: '',
    facility: undefined,
    venue: '',
    id: '',
    date: '',
    end_date: '',
    group: '',
    number_of_attendants: 0,
    number_of_sessions: 0,
    category: '',
    online: '',
    url: '',
    start_month: '',
    end_month: '',
    start_month_name: '',
    end_month_name: '',
    facility_id: '',
    facility_name: '',
    phone: '',
    email: ''
  };
  selected_facility!:CpdFacilityObject;
  facility_id!: string;
 

  can_view: boolean = true;
  can_create: boolean = true;
  can_delete: boolean = true;
  groups: string[] = []
  group: string = "doctors";

  categories: any[] = ["1", "2", "3"]
  category: any
  year: string;
  months: any[] = []

  cpdFacilitiesUrl: string = `${API_CPD_PATH}/getAllCpdFacilities`;
  loading: boolean = false;
  id?: string;

  selectFacilityTimestamp: string = "";
  constructor(private titleService: TitleService,
    private dbService: HttpService,
    private notify: NotifyService,
    private dateService: DateService,
    private authService: AuthService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  private router:Router) {
    //do the permissions
    this.titleService.setTitle("New CPD");
    if (this.authService.currentUser.permissions.indexOf("Cpd.Content.Create") == -1) {
      this.notify.notPermitted();
      this.goBack();
    }

    const date = new Date();
    this.year = date.getFullYear().toString();
    this.months = this.dateService.getMonthsNoPad();
    this.id = this.activatedRoute.snapshot.params['id']
  }

  ngOnInit() {
    if (this.id) {
      this.dbService.get<any>(`${API_CPD_PATH}/getCpdById/${this.id}`).pipe(take(1)).subscribe({
        next: (data) => {
          this.cpd = data.data;
          this.facility_id = data.data.facility_id;
          this.year = this.cpd.date.substring(0, 4);
        }
      })
    }


  }

  startAddFacility() {
    const dialogRef = this.dialog.open(AddCpdFacilityComponent, {
      data: {
        name: "",
        location: "",
        phone: "",
        email: "",
        number_organized: 0
      },

    });

    dialogRef.afterClosed().subscribe((result: CpdFacilityObject) => {
      if (result) {
        // this.facilities.push(result);
        this.facility_id = result.id;
        this.selectFacilityTimestamp = this.dateService.getToday("timestamp");
      }
    })
  }

  setFacility(args: CpdFacilityObject) {
    this.facility_id = args.id
    this.selected_facility = args
  }

  

  goBack() {
    window.history.back();
  }

  submit() {

    //console.log(this.cpd);
    this.notify.showLoading();
    this.loading = true;
    let data = new FormData();

    data.append("topic", this.cpd.topic);
    data.append("credits", this.cpd.credits);
    data.append("date", this.year + '-01-01');
    // data.append("end_date",this.cpd.end_date);
    // data.append("venue",this.cpd.venue);
    data.append("facility_id", this.facility_id);
    data.append("group", this.group);
    data.append("category", this.cpd.category)
    data.append("online", this.cpd.online);
    data.append("url", this.cpd.url);
    data.append("start_month", this.cpd.start_month)
    data.append("end_month", this.cpd.end_month)
    if (this.id) { data.append("id", this.id); }
    this.dbService.post<any>(`${API_CPD_PATH}/saveCpd`, data).subscribe({
      next: data => {
        this.notify.showNotification("CPD added successfully", "success", 3000);
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            title: "Continue?",
            message: "Do you want to add another CPD event?",
            icon: "",
            primaryButton: "Yes",
            secondaryButton: "No",
            closeOnTimer: false
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            this.router.navigate(['/cpd'])
          }
        })
        // this.cpd = new CpdObject();
        // $("#add_cpd_finished_modal").modal("show");


    }, error: () => {
      this.notify.noConnectionNotification();
      // console.log(error);

      },
      complete: () => {
        this.notify.hideLoading();
        this.loading = false;
    }});
  }
}
