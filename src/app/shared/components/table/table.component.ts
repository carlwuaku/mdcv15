import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { getLabelFromKey, openHtmlInNewWindow, replaceSpaceWithUnderscore } from '../../utils/helper';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
  @Input() columnLabels?: { [key: string]: string };
  @Input() rowSelection: "single" | "multiple" | undefined = "multiple"
  @Input() displayedColumns: string[] = [];
  selection = new SelectionModel<any>(true, []);
  @Input() specialClasses: { [key: string]: string } = {};
  @Input() customClassRules: { [key: string]: (row: any) => boolean } = {};
  @Input() offset: number = 0;
  destroy$: Subject<boolean> = new Subject();
  @Output() onSelect = new EventEmitter();
  replaceSpaceWithUnderscore = replaceSpaceWithUnderscore;
  constructor() { }
  ngOnInit(): void {
    this.selection.changed.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.onSelect.emit(data.source.selected)
    })
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(event: MatCheckboxChange) {
    event.checked ? this.selection.select(...this.dataSource.data) : this.selection.clear();
    // if (this.isAllSelected()) {
    //   this.selection.clear();
    //   return;
    // }

    // this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  getColumnClass(columnAndValue: string): string {
    return this.specialClasses[columnAndValue] || columnAndValue;
  }

  getColumnLabel(column: string): string {
    if (this.columnLabels && this.columnLabels[column]) {
      return this.columnLabels[column];
    }

    return getLabelFromKey(column, false);
  }


  isLink(content: string | null): boolean {
    return content && typeof content === 'string' ? content.startsWith('http') || content.startsWith('www') : false;
  }

  isHtml(content: string): boolean {
    const containsHtmlTagsRegex = /<[a-z][\s\S]*>/i;

    // Method 2: More complete HTML tag regex
    const htmlRegex = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i;

    // Method 3: Check for common HTML tags or entities
    const commonHtmlElements = /<(html|body|div|span|h[1-6]|p|br|table|tr|td|ul|ol|li|a|img)[^>]*>|&[a-z]+;/i;

    // Method 4: Check for doctype declaration
    const docType = /<!DOCTYPE html>/i;

    // Method 5: Check for specific HTML structure elements
    const htmlStructure = /<html[^>]*>[\s\S]*<\/html>/i;

    return htmlRegex.test(content);
    // containsHtmlTagsRegex.test(str)  ||
    // commonHtmlElements.test(str) ||
    // docType.test(str) ||
    // htmlStructure.test(str);
  }

  getRowClasses(row: any) {
    const classes: { [key: string]: boolean } = {
      'strikethrough': row.deleted_at
    };

    // Apply custom rules from parent
    for (const className in this.customClassRules) {
      classes[className] = this.customClassRules[className](row);
    }

    return classes;
  }

  viewHtml(html: string) {
    openHtmlInNewWindow(html);
  }

  public clearSelection() {
    this.selection.clear();
  }
}
