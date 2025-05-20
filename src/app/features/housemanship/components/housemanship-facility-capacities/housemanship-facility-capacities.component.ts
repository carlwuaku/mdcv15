import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { HousemanshipService } from '../../housemanship.service';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { name } from 'faker';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-housemanship-facility-capacities',
  templateUrl: './housemanship-facility-capacities.component.html',
  styleUrls: ['./housemanship-facility-capacities.component.scss']
})
export class HousemanshipFacilityCapacitiesComponent {
  data: Record<string, number> = {};
  availabilityDisciplines: { name: string, capacity: string }[] = [];
  destroy$: Subject<boolean> = new Subject();
  filterFormGroup = new FormGroup({
    year: new FormControl(new Date().getFullYear().toString(), [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
  });
  @Input() facilityName: string = '';
  constructor(private housemanshipService: HousemanshipService, private notify: NotifyService, private dialog: MatDialog) {

  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {

    this.getData();
  }

  getData() {
    if (this.filterFormGroup.invalid) {
      this.notify.failNotification('Please fill in all required fields');
      return;
    }
    this.housemanshipService.getFacilityDisciplineAndCapacities(this.filterFormGroup.get("year")?.value!, this.facilityName).subscribe((data) => {
      this.availabilityDisciplines = [];
      data.disciplines.data.forEach((item) => {
        this.availabilityDisciplines.push({ name: item.name, capacity: "0" })
      });
      data.capacities.data.forEach((item) => {
        this.availabilityDisciplines.map((discipline) => {
          if (discipline.name === item.discipline) {
            discipline.capacity = item.capacity.toString();
          }
        });
      });
    });
  }

  updateCapacity(object: { name: string, capacity: string }) {
    if (!window.confirm(`Are you sure you want to update this capacity entry for this facility for ${object.name}?`)) {
      return;
    }
    if (object.capacity === "" || object.capacity === undefined || parseInt(object.capacity) < 0 || isNaN(parseInt(object.capacity))) {
      this.notify.failNotification("Capacity cannot be empty or less than 0");
      return;
    }
    this.housemanshipService.createFacilityDisciplineCapacity({
      year: this.filterFormGroup.get("year")?.value!,
      facility_name: this.facilityName,
      discipline: object.name,
      capacity: parseInt(object.capacity),
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

  editCapacity(capacity: { name: string, capacity: string }) {
    if (!window.confirm(`Are you sure you want to update the capacity entry for this facility for ${capacity.name}?`)) {
      return;
    }
    const object: { [key: string]: string } = {
      discipline: capacity.name,
      capacity: capacity.capacity, facility_name: this.facilityName,
      year: this.filterFormGroup.get("year")?.value!, id: "1"
    };
    this.housemanshipService.getFacilityCapacityFormConfig().subscribe({
      next: (data) => {
        //set the facility_name
        data.data.map((field: IFormGenerator) => {
          field.value = object[field.name];
        });
        this.showAddDialog(data.data, "Edit Facility Capacity", object['id']);
      },
      error: error => {
        this.notify.failNotification("Error loading form");
      }
    })
  }

  showAddDialog(fields: IFormGenerator[], title: string, id?: string) {
    this.dialog.open(DialogFormComponent, {
      data: {
        fields, title,
        formType: "submit",
        url: "housemanship/facilities/capacities"
      },
      minWidth: '500px',
      maxWidth: '90vw'
    }).afterClosed().subscribe((data: IFormGenerator[]) => {
      //get an object of the name and value of the fields
      this.getData();
    })
  }
}
