import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Pager } from './Pager.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { DataActionsButton } from './data-actions-button.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { ImageModule } from 'primeng/image';
import { getLabelFromKey } from '../../utils/helper';

@Component({
  selector: 'app-load-data-list',
  templateUrl: './load-data-list.component.html',
  styleUrls: ['./load-data-list.component.scss']
})
export class LoadDataListComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  is_loading = false;
  // pagination things
  total: number = 0;
  @Input() offset: number = 0;
  @Input() limit = 100;
  @Input() totalRows = 0;
  @Input() currentPage: any = 1;

  destroy$: Subject<boolean> = new Subject();
  @Input() url: string = "";
  loading: boolean = false;
  error: boolean = false;
  error_message: string = "";
  @Input() module = "admin"
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
  @Input() timestamp: string = ""
  @Output() selectionChanged = new EventEmitter();
  @Input() columnLabels?: { [key: string]: string };
  @Input() rowSelection: "single" | "multiple" | undefined = "multiple"

  @Input() image_keys = ['picture', 'qr_code']

  @Input() selectedItems: any[] = [];
  @Output() onSelect = new EventEmitter();
  @Input() exclusionKeys = ['id', 'created_by', 'modified_on', 'deleted',
    'deleted_by', 'password_hash', 'last_ip']
  showTable: boolean = false;
  displayedColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  // @Input() actions: DataActionsButton[] = [];
  @Input() getActions: (row: any) => DataActionsButton[] = (row: any) => [];
  @Input() searchParam = "";
  selection = new SelectionModel<any>(true, []);
  @Input() withDeleted:boolean = false;
  constructor(private dbService: HttpService,
    private notify: NotifyService) {


  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.selection.changed.subscribe((data) => {
      this.onSelect.emit(data.source.selected)
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.timestamp)
    this.offset = 0;
    this.currentPage = 1;
    this.getData();
  }

  setPage(args: number) {
    this.currentPage = args;
    this.offset = (args - 1) * this.limit;
    this.getData();
  }

  setLimit(args: number) {
    this.limit = args;
    this.currentPage = 1;
    this.offset = 0;
    this.getData();
  }

  paramInputChanged() {
    //when cleared, load everything
    if (!this.searchParam.trim()) {
      this.offset = 0;
      this.getData();
    }
  }

  search() {
    this.offset = 0;
    this.getData();
  }




  getData() {
    this.loading = true;
    this.showTable = false;
    let extra = `page=${this.offset}&limit=${this.limit}`;
    if (this.searchParam.trim()) {
      extra += `&param=${this.searchParam}`
    }
    if(this.withDeleted){
      extra += `&withDeleted=yes`
    }
    const url = this.url.indexOf("?") == -1 ? this.url + '?' + extra : this.url + `&${extra}`;

    this.dbService.get<{ data: any[], total: number, columnLabels: any, displayColumns: string[] }>(url).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          data.data.map(item => {
            item.actions = this.getActions(item)
          })
          this.dataSource = new MatTableDataSource(data.data);

          this.error = false;
          this.totalRows = data.total;
          this.displayedColumns = ['#','select', "actions", ...data.displayColumns];
          this.columnLabels = data.columnLabels
          this.showTable = true;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.error(err)
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  getColumnLabel(column: string): string {
    if (this.columnLabels && this.columnLabels[column]) {
      return this.columnLabels[column];
    }

    return getLabelFromKey(column, false);
  }

  setSelected(args: any) {
    this.selectedItems = args;
    //emit it to any containing component
    this.selectionChanged.emit(this.selectedItems)
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


}
