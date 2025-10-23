import { Component, OnDestroy, OnInit } from '@angular/core';
import { CpdProviderObject } from '../../models/cpd_facility_model';
import { CpdService } from '../../cpd.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-providers-details',
  templateUrl: './providers-details.component.html',
  styleUrls: ['./providers-details.component.scss']
})
export class ProvidersDetailsComponent implements OnInit, OnDestroy {
  id: string;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object!: CpdProviderObject;


  isLoading: boolean = false;
  errorLoadingData: boolean = false;

  displayedColumns: string[] = [];
  destroy$: Subject<boolean> = new Subject();
  queryParams: { [key: string]: string } = {};
  cpdListBaseUrl: string = `cpd/details`;
  cpdListUrl: string = "";

  constructor(private cpdService: CpdService, private notify: NotifyService,
    private ar: ActivatedRoute) {
    this.id = ar.snapshot.params['id'];

  }

  ngOnInit() {

    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {
      if (!params.get('id')) {
        this.notify.failNotification('Please select a CPD provider');
        return;
      }
      this.id = params.get('id')!;
      this.queryParams = queryParams;
      this.getDetails();
      this.updateCpdListUrl();
    });
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

  filterChanged(filters: { [key: string]: string }) {
    this.queryParams = { ...filters };
    this.updateCpdListUrl();
  }

  updateCpdListUrl() {
    this.cpdListUrl = `${this.cpdListBaseUrl}?provider_uuid=${this.id}&` + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
