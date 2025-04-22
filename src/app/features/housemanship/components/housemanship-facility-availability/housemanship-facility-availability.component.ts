import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { HousemanshipService } from '../../housemanship.service';
import { HousemanshipAvailabilityCategories } from 'src/app/shared/types/AppSettings.model';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-housemanship-facility-availability',
  templateUrl: './housemanship-facility-availability.component.html',
  styleUrls: ['./housemanship-facility-availability.component.scss']
})
export class HousemanshipFacilityAvailabilityComponent implements OnInit {
  data: Record<string, number> = {};
  availabilityCategories: HousemanshipAvailabilityCategories = [];
  destroy$: Subject<boolean> = new Subject();
  filterFormGroup = new FormGroup({
    year: new FormControl(new Date().getFullYear().toString(), [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
  });
  @Input() facilityName: string = '';
  constructor(private appService: AppService, private housemanshipService: HousemanshipService, private notify: NotifyService) {

  }



  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.availabilityCategories = data.housemanship.availabilityCategories;
    });
    this.getData();
  }

  getData() {
    if (this.filterFormGroup.invalid) {
      this.notify.failNotification('Please fill in all required fields');
      return;
    }
    this.housemanshipService.getFacilityAvailability(this.filterFormGroup.get("year")?.value!, this.facilityName).subscribe((data) => {
      this.data = {};
      data.data.forEach((item) => {
        this.data[item.category] = item.available === "1" ? 1 : 0;
      });
      this.availabilityCategories.map((category) => {
        category.available = this.data[category.value] || 0;
      }
      );
    });
  }

  toggleAvailability(category: HousemanshipAvailabilityCategories[number]) {
    this.data[category.value] = !this.data[category.value] ? 1 : 0;
    this, this.housemanshipService.createFacilityAvailability({
      year: this.filterFormGroup.get("year")?.value!,
      facility_name: this.facilityName,
      category: category.value,
      available: this.data[category.value].toString(),
      id: ""
    }).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.getData();
      },
      error: (error) => {
        this.notify.failNotification(error.error.message);
      }
    }
    );
  }

}
