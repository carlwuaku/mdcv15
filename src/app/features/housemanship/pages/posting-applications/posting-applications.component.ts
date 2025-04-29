import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HousemanshipApplication } from '../../models/Housemanship_application.model';
import { AppService } from 'src/app/app.service';

type SelectionOption = {
  index: number, selectedOption: string, value: string

}

@Component({
  selector: 'app-posting-applications',
  templateUrl: './posting-applications.component.html',
  styleUrls: ['./posting-applications.component.scss']
})
export class PostingApplicationsComponent implements OnInit, OnDestroy {
  baseUrl: string = "housemanship/posting-application";
  @Input() url: string = "housemanship/posting-application";
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  queryParams: { [key: string]: string } = {};
  selectedItems: HousemanshipApplication[] = [];
  selectedOptions: SelectionOption[] = [];

  numberOfFacilities: number = 0;
  session: string = "1";
  constructor(
    public dialog: MatDialog, private ar: ActivatedRoute,
    private router: Router, private appService: AppService) {

  }
  ngOnInit(): void {
    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {
        this.queryParams = params;
        this.session = params['session'] || "1";
        this.appService.appSettings.pipe(take(1)).subscribe(data => {
          this.numberOfFacilities = data.housemanship.sessions[this.session]?.number_of_facilities || 0;
          //create an option for the number of facilities in selectedOptions
          this.selectedOptions = Array.from({ length: this.numberOfFacilities }, (_, index) => ({ index, selectedOption: "", value: "" }));
        });
        this.selectedItems = [];
        this.filters = [];
        this.updateUrl();
      });




  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


  updateUrl() {
    this.url = `${this.baseUrl}`;
    if (Object.keys(this.queryParams).length > 0) {
      this.url += "?" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
    }
  }

  filterSubmitted = (params: string) => {
    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });
    this.router.navigate(['housemanship/posting-applications'], { queryParams: paramsObject });
  }

  selectionChanged(items: HousemanshipApplication[]) {
    this.selectedItems = items;
  }

  setOption(index: number, value: string) {
    this.selectedOptions[index] = { index, selectedOption: value, value: value };
  }

  setOptionValue(option: SelectionOption, value: string) {
    option.value = value;
  }


  approveSelected() {
    if (this.selectedItems.length === 0) {
      alert("Please select at least one application to approve");
      return;
    }

    const approvedCount = this.selectedItems.length;
    const confirmed = window.confirm(`Are you sure you want to approve ${approvedCount} application(s)?`);
    if (!confirmed) {
      return;
    }
    const approvedApplications = this.selectedItems.map(item => {

      return {
        uuid: item.uuid,
        license_number: item.license_number,
        session: item.session,
        facilty_name: ''
      }
    }
    );
  }

  getSelectedApplicationFacility(application: HousemanshipApplication) {

  }
}
