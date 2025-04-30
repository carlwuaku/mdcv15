import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { HousemanshipApplication } from '../../models/Housemanship_application.model';
import { AppService } from 'src/app/app.service';
import { HousemanshipPosting } from '../../models/Housemanship_posting.model';
import { ConfirmPostingsComponent } from '../../components/confirm-postings/confirm-postings.component';
import { HousemanshipPostingDetail } from '../../models/Housemanship_posting_detail.model';

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
  selectedTemplate: string = "";
  selectedApplications: HousemanshipPosting[] = []
  constructor(
    public dialog: MatDialog, private ar: ActivatedRoute,
    private router: Router, private appService: AppService) {

  }
  ngOnInit(): void {
    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {
      this.session = params.get('session') || "0";
      this.queryParams = queryParams;
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
        uuid: "",
        first_name: item.first_name,
        last_name: item.last_name,
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
      if (result) {
        //send the data to the server
        // this.appService.appSettings.pipe(take(1)).subscribe(data => {
        //   const body = {
        //     license_number: this.selectedItems[0].license_number,
        //     session: this.session,
        //     letter_template: this.selectedTemplate,
        //     details: this.selectedApplications,
        //     year: data.housemanship.sessions[this.session].year
        //   }
        //   this.dbService.approvePostingApplication(body).subscribe({
        //     next: response => {
        //       alert(response.message);
        //       this.router.navigate(['housemanship/posting-applications']);
        //     },
        //     error: error => {
        //       alert(error.message);
        //     }
        //   });
        // });
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
}
