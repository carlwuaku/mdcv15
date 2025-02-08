import { Component, OnInit } from '@angular/core';
import { CpdProviderObject } from '../../models/cpd_facility_model';
import { CpdService } from '../../cpd.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-providers-details',
    templateUrl: './providers-details.component.html',
    styleUrls: ['./providers-details.component.scss'],
    standalone: false
})
export class ProvidersDetailsComponent implements OnInit {
  id: string;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object!: CpdProviderObject;


  isLoading: boolean = false;
  errorLoadingData: boolean = false;

  displayedColumns: string[] = []
  constructor(private cpdService: CpdService, private notify: NotifyService,
    ar: ActivatedRoute) {
    this.id = ar.snapshot.params['id'];

  }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    //load the cpd details and then attendees
    this.isLoading = true;
    this.errorLoadingData = false;
    this.cpdService.getCpdProviderDetails(this.id).subscribe({
      next: data => {
        this.object = data.data;
        this.displayedColumns = data.displayColumns;
        this.isLoading = false;
        this.errorLoadingData = false;

      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
      }
    });
  }
}
