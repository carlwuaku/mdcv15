import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { extractKeys, getLabelFromKey } from '../../utils/helper';
import { JsonDisplayComponent } from '../json-display/json-display.component';
import { ArrayLinksComponent } from '../array-links/array-links.component';
import { LinkNameComponent } from '../link-name/link-name.component';
import { DataListMenuButtonComponent } from '../data-list-menu-button/data-list-menu-button.component';
import { Pager } from './Pager.interface';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { DataActionsButton } from './data-actions-button.interface';

@Component({
  selector: 'app-load-data-list',
  templateUrl: './load-data-list.component.html',
  styleUrls: ['./load-data-list.component.scss']
})
export class LoadDataListComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('itemsGrid') agGrid!: AgGridAngular;
  gridApi!: GridApi;
  frameworkComponents: any;
  defaultColDef: { resizable: boolean; } = { resizable: true };
  @Input() getRowHeight: (params: any) => any  = function (params) {
    return 35;
  };

  is_loading = false;
  // pagination things
  total: number = 0;
  @Input() offset: number = 0;
  @Input() limit = 100;
  @Input() total_rows = 0;
  @Input() curr_page: any = 1;

  destroy$: Subject<boolean> = new Subject();
  @Input() url: string = "";
  loading: boolean = false;
  error: boolean = false;
  error_message: string = "";
  @Input() module = "admin"
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
  selectedItems: any[] = []
  @Input() timestamp: string = ""
  @Output() selectionChanged = new EventEmitter();
  @Input() columnLabels?: {[key:string]: string};
  @Input() rowSelection: "single" | "multiple" | undefined = "multiple"

  @Input() image_keys = ['picture', 'qr_code']

  @Input() selected_items: any[] = [];
  @Output() onSelect = new EventEmitter();
  @Input() exclusion_keys = ['id', 'created_by', 'modified_on', 'deleted',
    'deleted_by', 'password_hash', 'last_ip']
  show_table: boolean = false;
  displayedColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @Input() actions: DataActionsButton[] = [];

  constructor(private dbService: HttpService,
    private notify: NotifyService) {
    this.frameworkComponents = {
      JsonDisplayComponent,
      ArrayLinksComponent,
      LinkNameComponent,
      DataListMenuButtonComponent
    }

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {

    this.offset = 0;
    this.curr_page = 1;
    this.getData();
  }

  setPage(args: number) {
    this.curr_page = args;
    this.offset = (args - 1) * this.limit;
    this.getData();
  }

  setLimit(args: number) {
    this.limit = args;
    this.curr_page = 1;
    this.offset = 0;
    this.getData();
  }


  getData() {
    this.loading = true;
    const extra = `offset=${this.offset}&limit=${this.limit}`;
    const url = this.url.indexOf("?") == -1 ? this.url + '?' + extra : this.url + `&${extra}`;

    this.dbService.get<{data:any[], pager: Pager, columnLabels:any, displayColumns: string[]}>(url).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
            this.dataSource = new MatTableDataSource(data.data);
            this.error = false;
            this.total_rows = data.pager.total;
            this.displayedColumns = ['#', "actions",...data.displayColumns];
            this.columnLabels = data.columnLabels
            console.log(this.columnLabels)
            this.show_table = true;
            // this.prepData();

        },
        error: (err) => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  getColumnLabel(column:string):string{
    if(this.columnLabels && this.columnLabels[column]){
    return this.columnLabels[column];
  }
  const fullName = column.replace(/[-_]/g, ' ');
    return fullName.charAt(0).toUpperCase() + fullName.split('').slice(1).join('');
  }

  setSelected(args: any) {
    this.selectedItems = args;
    //emit it to any containing component
    this.selectionChanged.emit(this.selectedItems)
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  /**
   * called when selection is made
   */
  onSelectionChanged(params: SelectionChangedEvent) {
    var selectedRows = this.gridApi.getSelectedRows();
    this.onSelect.emit(selectedRows)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
   }

  prepData() {

    this.show_table = false;
    // if (!this.columnDefs) {
      // this.columnDefs = [
      //   {
      //     headerName: '#',
      //     valueGetter: "node.rowIndex + 1",
      //     width: 60,
      //     checkboxSelection: true,
      //     headerCheckboxSelection: true
      //   }
      // ];
      // console.log(this.objects)
      // if (this.objects.length > 0) {
      //   //extract the keys
      //   console.log(this.objects[0])
      //   let keys = extractKeys(this.objects[0], this.exclusion_keys);
      //   keys.forEach(key => {
      //     let label = getLabelFromKey(key);
      //     if (this.image_keys.indexOf(key) == -1) {

      //       this.columnDefs.push(
      //         { headerName: label, field: key, sortable: true, filter: true },

      //       )
      //       this.getRowHeight = function (params) {
      //         return 85;
      //       };
      //     }
      //     else {
      //       this.columnDefs.push(
      //         {
      //           headerName: label, field: key,
      //           cellRenderer: "JsonDisplayComponent",

      //           cellRendererParams: {
      //             type: 'custom',
      //             field_type: 'ignore',
      //             field_to_use: 'picture',
      //             is_image: true
      //           },
      //         },
      //       )
      //     }

      //   });
      // }
    // }
    this.show_table = true;
  }
}
