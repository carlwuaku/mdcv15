import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HousemanshipFacility } from '../../models/Housemanship_facility.model';
import { HousemanshipService } from '../../housemanship.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit, OnDestroy {
  baseUrl: string = "housemanship/facilities/details";
  @Input() url: string = "housemanship/facilities/details";
  ts: string = "";

  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  queryParams: { [key: string]: string } = {};
  selectedItems: HousemanshipFacility[] = [];
  constructor(private dbService: HousemanshipService, private notify: NotifyService,
    public dialog: MatDialog, private ar: ActivatedRoute, private appService: AppService,
    private router: Router) {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  ngOnInit(): void {
    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {

        this.queryParams = params;
        this.updateUrl();
      });


  }

  updateUrl() {

    this.url = `${this.baseUrl}`;
    if (Object.keys(this.queryParams).length > 0) {
      this.url += "?" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
    }
  }
  getActions = (license: HousemanshipFacility): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "View", type: "link", link: `housemanship/facilities/details/`, linkProp: 'uuid' },
      { label: "Edit", type: "link", link: `housemanship/facilities/edit/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (role: HousemanshipFacility) => this.delete(role) }
    ];


    return actions;
  }




  delete(license: HousemanshipFacility) {
    if (!window.confirm('Are you sure you want to delete this facility? You will be able to restore it')) {
      return;
    }
    this.dbService.deleteFacility(license.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  setSelectedItems(objects: HousemanshipFacility[]) {
    this.selectedItems = objects;
  }


  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });



    this.router.navigate(['housemanship/facilities'], { queryParams: paramsObject });

  }
}
