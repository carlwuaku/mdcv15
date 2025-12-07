import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { openHtmlInNewWindow, replaceSpaceWithUnderscore } from '../../utils/helper';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject, takeUntil } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { FieldTemplateDirective } from '../form-generator/form-generator.component';
import { TableLegendType } from './tableLegend.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogKeyValueDisplayComponent } from '../dialog-key-value-display/dialog-key-value-display.component';
import { SecureImageService } from 'src/app/core/services/secure-image/secure-image.service';

export interface EditableColumn {
  field: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox';
  options?: { value: any; label: string }[]; // For select type
  validator?: (value: any) => boolean;
  readonly?: boolean;
  onChange?: (value: any, row: any) => void;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
  @Input() columnLabels?: { [key: string]: string };
  @Input() rowSelection: "single" | "multiple" | undefined = "multiple"
  @Input() displayedColumns: string[] = [];
  @Input() editableColumns: EditableColumn[] = []; // New input for editable columns
  @Input() enableInlineEditing: boolean = false; // Toggle for edit mode
  selection = new SelectionModel<any>(true, []);
  @Input() specialClasses: { [key: string]: string } = {};
  @Input() customClassRules: { [key: string]: (row: any) => boolean } = {};
  @Input() offset: number = 0;
  destroy$: Subject<boolean> = new Subject();
  @Output() onSelect = new EventEmitter();
  @Output() onCellValueChange = new EventEmitter<{ row: any, field: string, oldValue: any, newValue: any }>();
  @Output() onRowSave = new EventEmitter<{ row: any, changes: any }>();
  @Input() showActions: boolean = true;
  @ViewChild(MatSort) sort!: MatSort;
  replaceSpaceWithUnderscore = replaceSpaceWithUnderscore;
  private templateMap = new Map<string, TemplateRef<any>>();
  @ContentChildren(FieldTemplateDirective) fieldTemplates!: QueryList<FieldTemplateDirective>;
  editingRows = new Set<any>();
  originalValues = new Map<any, any>();
  editableColumnMap = new Map<string, EditableColumn>();
  @Input() customClassLegends: TableLegendType[] = [];
  @Input() useVirtualScroll: boolean = false;
  @Input() showFilter: boolean = false;
  @Input() enableSorting: boolean = true;
  @Input() stickyHeader: boolean = false;
  @Input() stickyFirstColumn: boolean = false;
  filterValue: string = '';

  // Track loading state and cached secure links
  loadingLinks = new Map<string, boolean>();
  cachedSecureLinks = new Map<string, string>();

  constructor(
    private dialog: MatDialog,
    private secureImageService: SecureImageService
  ) { }
  ngAfterViewInit(): void {
    if (this.enableSorting) {
      this.dataSource.sort = this.sort;
    }
    this.fieldTemplates.forEach(item => {
      this.templateMap.set(item.fieldName, item.template);
    });
  }
  ngOnInit(): void {
    this.selection.changed.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.onSelect.emit(data.source.selected)
    })
    // Create a map for quick lookup of editable columns
    this.editableColumns.forEach(col => {
      this.editableColumnMap.set(col.field, col);
    });
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

  viewJson(json: string, title: string) {
    this.dialog.open(DialogKeyValueDisplayComponent, {
      data: { object: JSON.parse(json), title: replaceSpaceWithUnderscore(title) }
    })
  }

  public clearSelection() {
    this.selection.clear();
  }

  getCustomTemplate(fieldName: string): TemplateRef<any> | null {
    return this.templateMap.get(fieldName) || null;
  }


  // New methods for editable functionality
  isColumnEditable(column: string): boolean {
    return this.editableColumnMap.has(column) && this.enableInlineEditing;
  }

  isRowEditing(row: any): boolean {
    return this.editingRows.has(row);
  }

  startEditRow(row: any): void {
    // Store original values for potential rollback
    this.originalValues.set(row, { ...row });
    this.editingRows.add(row);
  }

  saveRow(row: any): void {
    const originalRow = this.originalValues.get(row);
    const changes: any = {};

    // Find what changed
    for (const key in row) {
      if (originalRow && originalRow[key] !== row[key]) {
        changes[key] = {
          oldValue: originalRow[key],
          newValue: row[key]
        };
      }
    }

    this.editingRows.delete(row);
    this.originalValues.delete(row);

    if (Object.keys(changes).length > 0) {
      this.onRowSave.emit({ row, changes });
    }
  }

  cancelEdit(row: any): void {
    const originalRow = this.originalValues.get(row);
    if (originalRow) {
      // Restore original values
      Object.assign(row, originalRow);
    }

    this.editingRows.delete(row);
    this.originalValues.delete(row);
  }

  onCellEdit(row: any, field: string, newValue: any): void {
    const oldValue = row[field];
    const editableColumn = this.editableColumnMap.get(field);

    // Validate if validator exists
    if (editableColumn?.validator && !editableColumn.validator(newValue)) {
      return; // Don't update if validation fails
    }

    row[field] = newValue;
    //run the onChange function
    if (editableColumn?.onChange) { editableColumn.onChange(newValue, row); }
    this.onCellValueChange.emit({ row, field, oldValue, newValue });
  }

  getEditableColumnConfig(field: string): EditableColumn | undefined {
    return this.editableColumnMap.get(field);
  }

  // Helper method to get select options for a field
  getSelectOptions(field: string): { value: any; label: string }[] {
    const config = this.editableColumnMap.get(field);
    return config?.options || [];
  }

  // Filter functionality
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Clear selection when filter is applied
    if (this.dataSource.filteredData.length === 0) {
      this.selection.clear();
    }
  }

  clearFilter(): void {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  openSecureLink(url: string): void {
    // Check if URL contains 'file-server' - if so, get signed URL
    if (!url.includes('file-server')) {
      // Not a secure link, open directly
      window.open(url, '_blank');
      return;
    }

    // Check if we already have a cached secure link
    const cachedLink = this.cachedSecureLinks.get(url);
    if (cachedLink) {
      window.open(cachedLink, '_blank');
      return;
    }

    // Check if already loading
    if (this.loadingLinks.get(url)) {
      return;
    }

    // Parse the URL to extract imageType and filename
    // Expected format: http://localhost:8080/file-server/image-render/applications/filename.jpg
    const parts = url.split('/');
    const fileServerIndex = parts.findIndex(part => part === 'file-server');

    if (fileServerIndex === -1 || parts.length < fileServerIndex + 3) {
      console.error('Invalid file-server URL format:', url);
      window.open(url, '_blank');
      return;
    }

    const imageType = parts[fileServerIndex + 2]; // e.g., 'applications'
    const filename = parts[fileServerIndex + 3]; // e.g., 'filename.jpg'

    // Set loading state
    this.loadingLinks.set(url, true);

    // Get signed URL and open in new tab
    this.secureImageService.getSignedUrl(imageType, filename)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (signedUrl) => {
          this.loadingLinks.set(url, false);
          if (signedUrl) {
            // Cache the secure link
            this.cachedSecureLinks.set(url, signedUrl);
            window.open(signedUrl, '_blank');
          } else {
            console.error('Failed to get signed URL for:', url);
          }
        },
        error: (err) => {
          this.loadingLinks.set(url, false);
          console.error('Error getting signed URL:', err);
        }
      });
  }

}
