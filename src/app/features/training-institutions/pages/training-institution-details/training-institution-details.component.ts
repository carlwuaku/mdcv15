import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { TrainingInstitution, TrainingInstitutionsService } from '../../training-institutions.service';

@Component({
  selector: 'app-training-institution-details',
  templateUrl: './training-institution-details.component.html',
  styleUrls: ['./training-institution-details.component.scss']
})
export class TrainingInstitutionDetailsComponent implements OnInit {
  id: string;

  can_edit: boolean = false;
  can_delete: boolean = true;

  object!: TrainingInstitution;


  isLoading: boolean = false;
  errorLoadingData: boolean = false;

  displayedColumns: string[] = []
  postingHistoryQueryParams: { [key: string]: string } = {};
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  constructor(private service: TrainingInstitutionsService, private ar: ActivatedRoute) {
    this.id = ar.snapshot.params['uuid'];

  }

  ngOnInit() {
    this.getDetails();

  }



  getDetails() {
    //load the cpd details and then attendees
    this.isLoading = true;
    this.errorLoadingData = false;
    this.service.getTrainingInstitution(this.id).subscribe({
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

  loadData = () => {
    return this.service.getTrainingInstitution(this.id)
  }

  filterSubmitted(filters: { [key: string]: string }) {
    this.postingHistoryQueryParams = { ...filters, ...this.postingHistoryQueryParams };
  }

}
