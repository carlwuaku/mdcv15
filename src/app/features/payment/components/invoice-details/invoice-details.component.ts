import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceObject } from '../../models/InvoiceModel';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceItemObject } from '../../models/InvoiceItem';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent {
  invoice: InvoiceObject;
  tableDataSource: MatTableDataSource<InvoiceItemObject> = new MatTableDataSource<InvoiceItemObject>([]);
  displayedColumns: string[] = ["description", "quantity", "unit_price", "line_total"];
  columnLabels: { [key: string]: string } = {
    unit_price: 'Rate',
    line_total: 'Total'
  }
  constructor(public dialogRef: MatDialogRef<InvoiceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InvoiceObject) {

    this.invoice = data
    this.tableDataSource = new MatTableDataSource<InvoiceItemObject>(data.items);
  }


}
