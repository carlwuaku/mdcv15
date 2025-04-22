import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DialogFormComponent } from 'src/app/shared/components/dialog-form/dialog-form.component';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { HousemanshipService } from '../../housemanship.service';
import { HousemanshipDiscipline } from '../../models/Housemanship_discipline.model';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss']
})
export class DisciplinesComponent implements OnInit {
  baseUrl: string = `housemanship/disciplines`;
  url: string = "";
  @Input() facilityName: string = "";
  ts: string = "";

  constructor(private dbService: HousemanshipService, private notify: NotifyService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.url = `${this.baseUrl}?facility_name=${this.facilityName}`;
  }

  getActions = (object: HousemanshipDiscipline): DataActionsButton[] => {

    const actions: DataActionsButton[] = [
      { label: "Edit", type: "button", onClick: (object: HousemanshipDiscipline) => this.editDiscipline(object) },
    ];
    if (object.deleted_at) {
      actions.push({ label: "Restore", type: "button", onClick: (object: HousemanshipDiscipline) => this.restore(object) })
    }
    else {
      actions.push({ label: "Delete", type: "button", onClick: (object: HousemanshipDiscipline) => this.delete(object) })
    }


    return actions;
  }

  delete(object: HousemanshipDiscipline) {
    if (!window.confirm(`Are you sure you want to delete this discipline: ${object.name}? It will make it unavailable for selection in the system. You can restore it later.`)) {
      return;
    }
    this.dbService.deleteDiscipline(object.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => {
        this.notify.failNotification(error.message);
      }
    })
  }

  restore(object: HousemanshipDiscipline) {
    if (!window.confirm(`Are you sure you want to restore this discipline: ${object.name}?`)) {
      return;
    }
    this.dbService.restoreDiscipline(object.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => {
        this.notify.failNotification(error.message);
      }
    })
  }


  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  addNewDiscipline() {
    this.dbService.getDisciplineFormConfig().subscribe({
      next: (data) => {
        //set the facility_name

        this.showAddDialog(data.data, "Add New Discipline");
      },
      error: error => {
        this.notify.failNotification("Error loading form");
      }
    })
  }

  editDiscipline(object: HousemanshipDiscipline) {
    this.dbService.getDisciplineFormConfig().subscribe({
      next: (data) => {
        data.data.map((field: IFormGenerator) => {
          field.value = object[field.name as keyof HousemanshipDiscipline];
        });
        this.showAddDialog(data.data, "Edit Discipline", object.id);
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
        url: id ? this.baseUrl + `/${id}` : this.baseUrl,
        id: id
      },
      minWidth: '500px',
      maxWidth: '90vw'
    }).afterClosed().subscribe((data: IFormGenerator[]) => {
      //get an object of the name and value of the fields
      this.updateTimestamp();
    })
  }
}
