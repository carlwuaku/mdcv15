import { Component, Inject } from '@angular/core';
import { HousemanshipPostingApplicationRequest } from '../../models/Housemanship_posting.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HousemanshipService } from '../../housemanship.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-confirm-postings',
  templateUrl: './confirm-postings.component.html',
  styleUrls: ['./confirm-postings.component.scss']
})
export class ConfirmPostingsComponent {
  letterTemplate: string = "";
  tableColumns = ["license_number", "first_name", "last_name", "session"];
  dataSource = new MatTableDataSource<Record<string, any>>();
  data: HousemanshipPostingApplicationRequest[] = [];
  loading: boolean = false;
  constructor(public dialogRef: MatDialogRef<ConfirmPostingsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: HousemanshipPostingApplicationRequest[], private housemanshipService: HousemanshipService, private notify: NotifyService) {

    this.data = dialogData;
    const tableData: Record<string, any>[] = [];
    //add the details disciplines, facility name to the table columns
    for (let i = 0; i < dialogData[0].details!.length; i++) {
      this.tableColumns.push(`discipline_${i + 1}`);
      this.tableColumns.push(`facility_name_${i + 1}`);
    }
    this.dataSource = new MatTableDataSource<Record<string, any>>();
    //add the facility and discipline to the data source
    dialogData.forEach((item) => {
      const rowData: Record<string, any> = {
        license_number: item.license_number,
        first_name: item.first_name,
        last_name: item.last_name,
        year: item.year,
        session: item.session
      };
      item.details?.forEach((detail, index) => {
        rowData[`discipline_${index + 1}`] = detail.discipline;
        rowData[`facility_name_${index + 1}`] = detail.facility_name;
      });
      tableData.push(rowData);
    });
    this.dataSource = new MatTableDataSource(tableData);
  }

  setLetterTemplate(template: string) {
    this.letterTemplate = template;
  }

  approvePostings() {
    //set the letter template to each posting and submit
    if (!this.letterTemplate) {
      this.notify.failNotification("Please select a letter template");
      return;
    }
    this.notify.showLoading();
    this.loading = true;
    this.data = this.data.map((item) => {
      item.letter_template = this.letterTemplate;
      return item;
    });
    this.housemanshipService.approvePostingApplication({ data: this.data }).subscribe(
      {
        next: (res) => {
          this.notify.hideLoading();
          this.loading = false;
          const failedApplications = this.data.filter((item) => {
            return res.data.find((resItem) => resItem.license_number === item.license_number && !resItem.successful);
          })
          if (failedApplications.length > 0) {
            this.notify.failNotification(`Failed to approve ${failedApplications.length} application(s)`);
          }
          const successfulApplications = this.data.filter((item) => {
            return res.data.find((resItem) => resItem.license_number === item.license_number && resItem.successful);
          })
          if (successfulApplications.length > 0) {
            this.notify.successNotification(`Successfully approved ${successfulApplications.length} application(s)`);
          }
          this.dialogRef.close({
            successfulApplications,
            failedApplications
          });
        },
        error: (err) => {
          this.notify.hideLoading();
          this.loading = false;
          this.dialogRef.close(false);
        }
      }
    )
  }
}
