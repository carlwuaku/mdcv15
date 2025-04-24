import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { HousemanshipPosting } from '../../models/Housemanship_posting.model';

@Component({
  selector: 'app-housemanship-postings-list',
  templateUrl: './housemanship-postings-list.component.html',
  styleUrls: ['./housemanship-postings-list.component.scss']
})
export class HousemanshipPostingsListComponent {
  baseUrl: string = "housemanship/posting";
  @Input() url: string = "housemanship/posting";
  ts: string = "";

  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  queryParams: { [key: string]: string } = {};
  selectedItems: HousemanshipPosting[] = [];
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
  getActions = (object: HousemanshipPosting): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `housemanship/postings/edit/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: HousemanshipPosting) => this.delete(object) }
    ];


    return actions;
  }




  delete(object: HousemanshipPosting) {
    if (!window.confirm('Are you sure you want to delete this posting?')) {
      return;
    }
    this.dbService.deletePosting(object.uuid).subscribe({
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

  setSelectedItems(objects: HousemanshipPosting[]) {
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



    this.router.navigate(['housemanship/postings'], { queryParams: paramsObject });

  }
}
