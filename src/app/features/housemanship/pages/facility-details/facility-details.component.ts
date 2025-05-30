import { Component, OnInit, ViewChild } from '@angular/core';
import { HousemanshipFacility } from '../../models/Housemanship_facility.model';
import { HousemanshipService } from '../../housemanship.service';
import { ActivatedRoute } from '@angular/router';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss']
})
export class FacilityDetailsComponent implements OnInit {
  id: string;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object!: HousemanshipFacility;


  isLoading: boolean = false;
  errorLoadingData: boolean = false;

  displayedColumns: string[] = []
  postingHistoryQueryParams: { [key: string]: string } = {};
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  constructor(private service: HousemanshipService, private ar: ActivatedRoute) {
    this.id = ar.snapshot.params['id'];

  }

  ngOnInit() {
    this.getDetails();

  }



  getDetails() {
    //load the cpd details and then attendees
    this.isLoading = true;
    this.errorLoadingData = false;
    this.service.getFacilityDetails(this.id).subscribe({
      next: data => {
        this.object = data.data;
        this.postingHistoryQueryParams['facility_name'] = this.object.name;
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

  filterSubmitted(filters: { [key: string]: string }) {
    this.postingHistoryQueryParams = { ...filters, ...this.postingHistoryQueryParams };
  }
}
