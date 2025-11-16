import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingInstitutionsService, TrainingInstitution } from '../../training-institutions.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { getToday } from 'src/app/shared/utils/dates';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-institutions-list',
  templateUrl: './institutions-list.component.html',
  styleUrls: ['./institutions-list.component.scss']
})
export class InstitutionsListComponent implements OnInit {
  baseUrl: string = "training-institutions/details";
  url = 'training-institutions/details';
  displayedColumns: string[] = ['name', 'location', 'type', 'region', 'district', 'contact_name', 'phone', 'email', 'status', 'student_count'];
  filters: IFormGenerator[] = [];
  selectedItems: TrainingInstitution[] = [];
  ts: string = "";
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  queryParams: { [key: string]: string } = {};
  destroy$: Subject<boolean> = new Subject();
  constructor(
    private router: Router,
    private ar: ActivatedRoute,
    private trainingInstitutionsService: TrainingInstitutionsService
  ) { }

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



  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });



    this.router.navigate(['training-institutions/list'], { queryParams: paramsObject });

  }

  getActions = (row: TrainingInstitution): DataActionsButton[] => {
    return [
      { label: "View", type: "link", link: `training-institutions/details/`, linkProp: 'uuid' },
      { label: "Edit", type: "link", link: `training-institutions/edit/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (obj: TrainingInstitution) => this.delete(obj) },
      { label: "Manage limits", type: "link", link: `training-institutions/limits/`, linkProp: 'uuid' }

    ];
  }

  viewDetails(institution: TrainingInstitution): void {
    this.router.navigate(['/training-institutions', institution.uuid]);
  }

  edit(institution: TrainingInstitution): void {
    this.router.navigate(['/training-institutions', institution.uuid, 'edit']);
  }

  manageLimits(institution: TrainingInstitution): void {
    this.router.navigate(['/training-institutions', institution.uuid, 'limits']);
  }

  delete(institution: TrainingInstitution): void {
    this.trainingInstitutionsService.deleteTrainingInstitution(institution.uuid).subscribe({
      next: (response) => {
        alert(response.message);
        this.updateTimestamp();
      },
      error: (error) => {
        console.error('Error deleting institution:', error);
        alert('Failed to delete training institution');
      }
    });
  }



  setSelectedItems(objects: TrainingInstitution[]) {
    this.selectedItems = objects;
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  createNew(): void {
    this.router.navigate(['/training-institutions', 'new']);
  }
}
