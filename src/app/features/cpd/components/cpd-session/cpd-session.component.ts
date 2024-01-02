import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { API_CPD_PATH } from 'src/app/shared/utils/constants';
import { CpdObject } from '../../models/cpd_model';
import { CpdSessionObject, newCpdSessionObject } from '../../models/cpd_session_model';

@Component({
  selector: 'app-cpd-session',
  templateUrl: './cpd-session.component.html',
  styleUrls: ['./cpd-session.component.scss']
})
export class CpdSessionComponent implements OnInit {
  @Input() session!: CpdSessionObject;
  @Input() cpd!: CpdObject;


  can_create: boolean = false;
  can_add_attendance: boolean = false;

  objects: CpdSessionObject[] = [];
  is_loading: boolean = false;
  error: boolean = false
  is_loaded: boolean = false;
  @Output() onSelect = new EventEmitter<CpdSessionObject>();

  constructor(private dbService: HttpService, private dateService: DateService,
    private notify: NotifyService, private authService: AuthService) {
    if (this.authService.currentUser?.permissions.includes("Cpd.Facilities.Manage")) {
      this.can_create = true;
    }
    if (this.authService.currentUser?.permissions.includes("Cpd.Attendance.Create")) {
      this.can_add_attendance = true;
      //this.goBack();
    }
  }

  ngOnInit() {
    this.getSession();
  }


  regionSelected(args: string) {
    this.session.region = args;
  }


  start() {
    this.session = newCpdSessionObject;
    // $("#modal").modal("show");
    //TODO: open dialog here
  }

  edit(session: CpdSessionObject) {
    this.session = session;
    // $("#modal").modal("show");
    //TODO: open dialog here

  }

  submit() {
    this.notify.showLoading();
    let data = new FormData();
    data.append("venue", this.session.venue);
    if (this.cpd.id) { data.append("cpd_id", this.cpd.id); }
    data.append("start_time", this.session.start_time);
    data.append("end_time", this.session.end_time);
    data.append("date", this.session.date);
    data.append("region", this.session.region);
    data.append("id", this.session.id)
    this.dbService.post<any>(`${API_CPD_PATH}/addCpdSession`, data).pipe(take(1)).subscribe({
      next: data => {
        this.session.cpd = this.cpd;
        if (this.session.id == null) {
          this.objects.push(this.session)
        }

        this.session.id = data.status;
        this.session = newCpdSessionObject;
        this.notify.successNotification("session added successfully");


      },
      error: error => {
        this.notify.hideLoading();
      }
    });
  }

  getSession() {
    this.is_loaded = false;
    this.is_loading = true;
    this.dbService.get<any>(`${API_CPD_PATH}/getSessions?cpd_id=${this.cpd.id}`)
      .pipe(take(1)).subscribe({
        next: data => {
          this.objects = data.data
          this.is_loaded = true;
          this.is_loading = false;
          this.error = false;
        },
        error: error => {
          this.is_loaded = false;
          this.is_loading = false;
          this.error = true;

        }
      });

  }

  select(session: CpdSessionObject) {
    this.onSelect.emit(session);
  }

  delete(h: CpdSessionObject) {
    if (window.confirm("Sure you want to delete this cpd session? Attendance done with this session will be left intact")) {
      let data = new FormData();

      data.append("id", h.id);
      data.append("venue", h.venue);
      data.append("cpd_id", this.cpd.id!)
      this.dbService.post<any>(`${API_CPD_PATH}/deleteSession`, data).pipe(take(1)).subscribe(
        {
          next: data => {
            this.objects.splice(this.objects.indexOf(h), 1);
            this.notify.showNotification("cpd session deleted successfully", "success", 3000);
          }, error: error => {
            this.notify.noConnectionNotification();

          }
        });
    }
  }

  dateIsBefore(date1:string): boolean{
   return this.dateService.compareDates(date1) === "before"
  }
}
