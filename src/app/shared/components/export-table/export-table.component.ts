import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as FileSaver from 'file-saver';
import { extractKeys, getLabelFromKey } from '../../utils/helper';

@Component({
    selector: 'app-export-table',
    templateUrl: './export-table.component.html',
    styleUrls: ['./export-table.component.scss'],
    standalone: false
})
export class ExportTableComponent implements OnChanges {
  
  @Input() objects: any[] = [];
  @Input() filename = "download";
  @Input() exclusion_keys = ['id', 'created_by', 'modified_on', 'deleted', 'deleted_by', 'password_hash', 'last_ip']

  cols: any[] = [];


  exportColumns: any[] = [];


  ngOnChanges(changes: SimpleChanges): void {

    if (this.objects.length > 0) {
      //extract the keys

      let keys = extractKeys(this.objects[0], this.exclusion_keys);
      keys.forEach(key => {
        let label = getLabelFromKey(key);
        this.cols.push(
          { header: label, field: key, sortable: true, filter: true },

        )

      });
    }

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.objects);
        doc.save('products.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.objects);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
