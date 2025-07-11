import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CpdObject } from '../../models/cpd_model';
import { CpdAttendanceObject } from '../../models/cpd_attendance_model';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { CpdService } from '../../cpd.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  id: string;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object!: CpdObject;

  show_pics: boolean = false;

  selected: CpdAttendanceObject[] = []
  isLoading: boolean = false;
  errorLoadingData: boolean = false;
  //MIGRATION
  migration_cpd: any = null;
  migration_venue: any = "";
  migration_date: any = '';

  add_by = "manually";
  filename!: string;
  excel_col = 1;
  displayedColumns: string[] = []


  headerTabs: { label: string, key: string }[] = [];

  constructor(private cpdService: CpdService, private notify: NotifyService,
    ar: ActivatedRoute) {
    this.id = ar.snapshot.params['id'];

  }

  ngOnInit() {
    this.getCpdDetails();
  }

  getCpdDetails() {
    //load the cpd details and then attendees
    this.isLoading = true;
    this.errorLoadingData = false;
    this.cpdService.getCpdDetails(this.id).subscribe({
      next: data => {
        this.object = data.data;
        this.displayedColumns = data.displayColumns;
        this.isLoading = false;
        this.errorLoadingData = false;
        this.headerTabs = [
          { label: "Provider", key: this.object.provider_name || "" },
          { label: "Category", key: this.object.category || "" },
          { label: "Year", key: this.object.date || "" },
          { label: "Credits", key: this.object.credits || "" },
          { label: "Online", key: this.object.online || "" },
          { label: "URL", key: this.object.url || "" },
        ]
        // this.getAttendees();
      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }

}
