import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HousemanshipApplication } from '../../models/Housemanship_application.model';
import { AppService } from 'src/app/app.service';
import { HousemanshipPostingApplicationRequest } from '../../models/Housemanship_posting.model';
import { ConfirmPostingsComponent } from '../../components/confirm-postings/confirm-postings.component';
import { HousemanshipPostingDetail } from '../../models/Housemanship_posting_detail.model';
import { PrepMessagingComponent } from 'src/app/shared/components/prep-messaging/prep-messaging.component';
import { PostingApplicationsListComponent } from '../../components/posting-applications-list/posting-applications-list.component';

type SelectionOption = {
  index: number, selectedOption: string, value: string

}

@Component({
  selector: 'app-posting-applications',
  templateUrl: './posting-applications.component.html',
  styleUrls: ['./posting-applications.component.scss']
})
export class PostingApplicationsComponent implements OnInit, OnDestroy, AfterViewInit {
  baseUrl: string = "housemanship/posting-application";
  @Input() url: string = "housemanship/posting-application";
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  queryParams: { [key: string]: string } = {};
  selectedItems: HousemanshipApplication[] = [];
  selectedOptions: SelectionOption[] = [];

  numberOfFacilities: number = 0;
  session: string = "1";
  selectedTemplate: string = "";
  selectedApplications: HousemanshipPostingApplicationRequest[] = []
  @ViewChild('prepMessageComponent') prepMessageComponent!: PrepMessagingComponent
  @ViewChild('applicationsList') applicationsList!: PostingApplicationsListComponent;
  constructor(
    public dialog: MatDialog, private ar: ActivatedRoute,
    private router: Router, private appService: AppService) {

  }
  ngAfterViewInit(): void {
    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {

      this.applicationsList.clearSelection();
    });
  }
  ngOnInit(): void {
    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {
      this.selectedItems = [];
      this.selectedOptions = [];
      this.session = params.get('session') || "0";
      this.queryParams = queryParams;
      this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
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
    this.url = `${this.baseUrl}?session=${this.session}`;
    if (Object.keys(this.queryParams).length > 0) {
      this.url += "&" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
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
    this.router.navigate([`housemanship/posting-applications/${this.session}`], { queryParams: paramsObject });
  }

  selectionChanged(items: HousemanshipApplication[]) {
    this.selectedItems = items;
  }

  /**
   * set the selected option for a facility. if the value is 1, it means the first choice, if 2, it means the second choice. else it the user has to select the facility from the list
   * @param index
   * @param value
   */
  setOption(index: number, value: string) {
    this.selectedOptions[index] = { index, selectedOption: value, value: !["1", "2"].includes(value) ? "" : value };
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
    this.selectedApplications = this.selectedItems.map(item => {
      const details: HousemanshipPostingDetail[] = [];
      for (let i = 0; i < this.numberOfFacilities; i++) {
        const selectedOption = this.selectedOptions[i];
        const facilityName = this.getSelectedApplicationFacility(item, selectedOption);
        if (facilityName) {
          details.push({
            facility_name: facilityName,
            start_date: null,
            end_date: null,
            discipline: item[`discipline_${i + 1}` as keyof HousemanshipApplication]!,
            id: 0,
            posting_uuid: "",
            facility_region: ""

          });
        }
      }
      return {
        license_number: item.license_number,
        session: item.session,
        year: item.year,
        details: details,
        letter_template: "",
        type: item.type,
        application_uuid: item.uuid,
        first_name: item.first_name,
        last_name: item.last_name,
        tags: item.tags,
        email: item.email,
      }
    });
    //show the modal
    const dialogRef = this.dialog.open(ConfirmPostingsComponent, {
      data: this.selectedApplications,
      minWidth: '600px',
      maxHeight: '90vh',
      minHeight: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false && result.successfulApplications.length > 0) {
        //prompt the user to send emails to the successful applications
        this.prepMessageComponent.objects = result.successfulApplications;
        this.prepMessageComponent.emailField = "email";
        this.prepMessageComponent.labelField = "first_name, last_name";
        this.prepMessageComponent.prepMailList();//uses the objects to get the emails
        this.prepMessageComponent.openDialog();
        this.applicationsList.dataList.reload()

        // window.location.reload();//TODO: change this to a better way of refreshing the page
      }
    });
  }

  getSelectedApplicationFacility(application: HousemanshipApplication, selectedOption: SelectionOption) {
    //if option 1 is chosen, return the application's first choice.
    //if option 2 is chosen, return the application's second choice.
    //else return the actual facility name. the selectedOptions apply to all selected applications

    //get all the disciplines and their facilities. they're named discipline_1, discipline_2, first_choice_1, first_choice_2, second_choice_1, second_choice_2 etc
    if (selectedOption.selectedOption === "1") {
      return application[`first_choice_${selectedOption.index + 1}` as keyof HousemanshipApplication];
    } else if (selectedOption.selectedOption === "2") {
      return application[`second_choice_${selectedOption.index + 1}` as keyof HousemanshipApplication];
    } else {
      return selectedOption.value;
    }

  }

  setLetterTemplate(template: string) {
    this.selectedTemplate = template;
  }

  allOptionsSelected(): boolean {
    //check if all the options are selected
    return this.selectedOptions.every(option => option.value !== "");
  }


}
