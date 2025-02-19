import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { PractitionerObject } from '../models/practitioner_model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { replaceSpaceWithUnderscore } from 'src/app/shared/utils/helper';
import { EditImageComponent } from 'src/app/shared/components/edit-image/edit-image.component';

@Component({
  selector: 'app-practitioner-details',
  templateUrl: './practitioner-details.component.html',
  styleUrls: ['./practitioner-details.component.scss']
})
export class PractitionerDetailsComponent implements OnInit {
  id: string | null = null;
  object: PractitionerObject | null = null;
  loading: boolean = false;
  columnLabels?: { [key: string]: string };
  displayedColumns: string[] = [];
  errorLoadingData: boolean = false;
  replaceSpaceWithUnderscore = replaceSpaceWithUnderscore;

  constructor(private notify: NotifyService,
    private dbService: HttpService, private ar: ActivatedRoute, public dialog: MatDialog) {
    this.id = ar.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getExistingObject()
  }

  getExistingObject() {
    this.loading = true;
    this.errorLoadingData = false;
    this.notify.showLoading();
    this.dbService.get<{ data: PractitionerObject, columnLabels: { [key: string]: string }, displayColumns: string[] }>(`practitioners/details/${this.id}`).subscribe(
      {
        next: data => {
          this.object = data.data;
          this.columnLabels = data.columnLabels;
          this.displayedColumns = data.displayColumns;

          this.notify.hideLoading();
        },
        error: error => {
          console.log(error);
          this.errorLoadingData = true;
          this.object = null;
          // this.notify.failNotification("Error loading data. Please try again")
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

  editImage() {
    const dialogRef = this.dialog.open(EditImageComponent, {
      data: this.object,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getExistingObject()
      }
    });
  }

}
