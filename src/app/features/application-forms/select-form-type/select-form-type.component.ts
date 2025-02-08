import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { ApplicationFormObject, ApplicationTypeCounts } from '../models/application-form.model';
import { ApplicationFormService } from '../application-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { ApplicationTemplateObject } from '../../../shared/types/application-template.model';



@Component({
  selector: 'app-select-form-type',
  templateUrl: './select-form-type.component.html',
  styleUrls: ['./select-form-type.component.scss']
})
export class SelectFormTypeComponent implements OnInit, OnDestroy {
  baseUrl: string = "applications/statusCounts";
  url: string = "applications/statusCounts";
  ts: string = "";
  formType: string = "";
  status: string = "";

  statusCounts: ApplicationTypeCounts[] = [];
  countsLoading: boolean = false;
  destroy$: Subject<boolean> = new Subject();
  constructor(private applicationService: ApplicationFormService, private ar: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {
    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.formType = params['form_type'];
      this.status = params['status'];
      if (this.formType) {
        this.getFormStatusCounts(this.setUrl());
      }
    });


  }



  setUrl(): string {

    this.url = this.baseUrl + `/${encodeURI(this.formType)}`;
    return this.url;
  }

  getActions = (object: ApplicationTypeCounts): DataActionsButton[] => {

    const actions: DataActionsButton[] = [


      {
        label: "Go to applications", type: "link", link: `applications/`,
        linkProp: 'uuid', urlParams: { form_type: object.form_type, status: object.status }
      }

    ];

    return actions;
  }

  getFormStatusCounts(url: string) {
    this.countsLoading = true;
    this.applicationService.getFormStatusCounts(url).pipe(take(1)).subscribe(
      {
        next: (data) => {
          this.statusCounts = data.data;
          this.countsLoading = false;
        },
        error: (error) => {
          this.countsLoading = false;
        }
      })
  }

  formTypeSelected(args: ApplicationTemplateObject) {
    this.router.navigate(['/applications/application-types'], {
      queryParams: { form_type: args.form_name }
    })
  }

  getFormStatusUrl(status: ApplicationTypeCounts) {
    return "applications/?form_type=" + status.form_type + "&status=" + status.status;
  }

  createUrl(formType: string, status: string): string {
    return encodeURI(this.router.createUrlTree(['/applications'], {
      queryParams: {
        form_type: formType,
        status: status
      }
    }).toString());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
