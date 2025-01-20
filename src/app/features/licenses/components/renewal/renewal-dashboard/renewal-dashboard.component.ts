import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { RenewalStageItems } from 'src/app/shared/utils/data';

@Component({
  selector: 'app-renewal-dashboard',
  templateUrl: './renewal-dashboard.component.html',
  styleUrls: ['./renewal-dashboard.component.scss']
})
export class RenewalDashboardComponent implements OnInit, OnDestroy {
  menuItems: RenewalStageItems[] = []
  destroy$: Subject<boolean> = new Subject();
  licenseType: string = "";
  constructor(private appService: AppService, private ar: ActivatedRoute, private router: Router) {
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {

    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {
        this.licenseType = params['licenseType'];
        if (this.licenseType) {
          this.getMenuItems()
        }
      });
  }

  getMenuItems() {
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {

      const stages = data.licenseTypes[this.licenseType] ?
        data.licenseTypes[this.licenseType].renewalStages : {};
      this.menuItems = Object.keys(stages).map(key => stages[key]);
      console.log(this.menuItems)
    });
  }

  onLicenseTypeChange(selectedValue: string) {
    this.router.navigate(['licenses/renewal-dashboard'], { queryParams: { licenseType: selectedValue } });
  }

}
