import { Component } from '@angular/core';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { getClassFromState, replaceSpaceWithUnderscore } from 'src/app/shared/utils/helper';
import { EditImageComponent } from 'src/app/shared/components/edit-image/edit-image.component';
import { LicenseObject } from '../../models/license_model';
import { LicensesService } from '../../licenses.service';
import { AppService } from 'src/app/app.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  id: string | null = null;
  object: LicenseObject | null = null;
  loading: boolean = false;
  columnLabels?: { [key: string]: string };
  displayedColumns: string[] = [];
  errorLoadingData: boolean = false;
  replaceSpaceWithUnderscore = replaceSpaceWithUnderscore;
  destroy$: Subject<boolean> = new Subject();
  headerTabs: { label: string, key: string }[] = [];
  detailsTabs: { label: string, key: string }[] = [];
  excludedDetailsColumns: string[] = ['uuid', 'picture'];
  getClassFromState = getClassFromState;
  postingHistoryQueryParams: { [key: string]: string } = {};
  constructor(private notify: NotifyService,
    private dbService: LicensesService, private ar: ActivatedRoute, public dialog: MatDialog, private appService: AppService) {
    this.id = ar.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getExistingObject();
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.updateHeaderTabs();
    });
  }

  updateHeaderTabs() {
    if (!this.object) return;
    const type = this.object.type;
    this.headerTabs = this.appService.appSettings.value.licenseTypes[type].detailsPageHeaderTabs || [];
    this.detailsTabs = this.appService.appSettings.value.licenseTypes[type].detailsPageTabs || [];

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getExistingObject() {
    if (!this.id) return;
    this.loading = true;
    this.errorLoadingData = false;
    this.notify.showLoading();
    this.dbService.getLicenseDetails(this.id).subscribe(
      {
        next: data => {
          this.object = data.data;
          this.postingHistoryQueryParams['license_number'] = this.object['register_type'] === 'Provisional' ? this.object.license_number : this.object['provisional_number'];
          this.columnLabels = data.columnLabels;
          this.displayedColumns = data.displayColumns.filter((col: string) => !this.excludedDetailsColumns.includes(col));
          this.updateHeaderTabs();
          this.notify.hideLoading();
        },
        error: error => {
          console.log(error);
          this.errorLoadingData = true;
          this.object = null;
          // this.notify.failNotification("Error loading data. Please try again")
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

  editImage() {
    if (!this.object) return;
    const dialogRef = this.dialog.open(EditImageComponent, {
      data: {
        uuid: this.object.uuid, picture: this.object.picture, name: this.object.name,
        unique_id: this.object.license_number, updateUrl: "licenses/details"
      },
      minWidth: "40vw"

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getExistingObject()
      }
    });
  }

  housemanshipPostingsListFilterSubmitted(filters: { [key: string]: string }) {
    this.postingHistoryQueryParams = { ...filters, ...this.postingHistoryQueryParams };
  }

  isInDetailsTabs(key: string): boolean {
    return this.detailsTabs.some(tab => tab.key === key);
  }

  getTabTitle(key: string): string {
    return this.detailsTabs.find(tab => tab.key === key)?.label || '';
  }
}
