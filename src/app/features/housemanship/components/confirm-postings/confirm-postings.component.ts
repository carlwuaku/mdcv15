import { Component, Inject } from '@angular/core';
import { HousemanshipPosting } from '../../models/Housemanship_posting.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-confirm-postings',
  templateUrl: './confirm-postings.component.html',
  styleUrls: ['./confirm-postings.component.scss']
})
export class ConfirmPostingsComponent {
  letterTemplate: string = "";
  tableColumns = ["license_number", "first_name", "last_name", "discipline", "session", "facility_name"];
  dataSource = new MatTableDataSource<Record<string, any>>();
  data: HousemanshipPosting[] = [];
  constructor(public dialogRef: MatDialogRef<ConfirmPostingsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: HousemanshipPosting[]) {
    console.log(dialogData);
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
}
