import { Component, OnInit } from '@angular/core';
import { HousemanshipFacility } from '../../models/Housemanship_facility.model';
import { HousemanshipService } from '../../housemanship.service';
import { ActivatedRoute } from '@angular/router';

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
