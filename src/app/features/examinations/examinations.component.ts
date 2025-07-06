import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ExaminationService } from './examination.service';
import { takeUntil, take, Subject } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';

@Component({
  selector: 'app-examinations',
  templateUrl: './examinations.component.html',
  styleUrls: ['./examinations.component.scss']
})
export class ExaminationsComponent implements OnInit {
  queryParams: { [key: string]: string } = {};
  baseUrl: string = `examinations/details`;
  url: string = "";
  can_edit: boolean = false;
  can_delete: boolean = false;
  destroy$: Subject<boolean> = new Subject();
  filters: IFormGenerator[] = [];
  constructor(private examService: ExaminationService, private appService: AppService,
    private notify: NotifyService, private authService: AuthService, private ar: ActivatedRoute, private router: Router) {
    if (this.authService.currentUser?.permissions.includes("Cpd.Content.Edit")) {
      this.can_edit = true;
    }
    if (this.authService.currentUser?.permissions.includes("Cpd.Content.Delete")) {
      this.can_delete = true;
    }
  }
  ngOnInit(): void {
    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {

        this.queryParams = params;
        this.appService.appSettings.pipe(take(1)).subscribe(data => {
          this.filters = data?.examinations.filterFields;
          this.filters.forEach(filter => {
            filter.value = params[filter.name];
          });
          this.updateUrl();
        })
      });

  }

  updateUrl() {

    this.url = `${this.baseUrl}` + "?" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }

  filterSubmitted(params: Record<string, any>) {

    this.router.navigate(['examinations'], { queryParams: params });
  }
}
