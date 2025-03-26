import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { Pager } from './Pager.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { DataActionsButton } from './data-actions-button.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { ImageModule } from 'primeng/image';
import { getLabelFromKey, isArray, replaceSpaceWithUnderscore } from '../../utils/helper';
import { columnFilterInterface } from './data-list-interface';
import { IFormGenerator } from '../form-generator/form-generator-interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseObject } from '../../types/ApiResponseObject';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-load-data-list',
  templateUrl: './load-data-list.component.html',
  styleUrls: ['./load-data-list.component.scss']
})
export class LoadDataListComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sortDialog') sortDialog!: TemplateRef<any>;
  @ViewChild('filtersContainer') filtersContainer!: ElementRef;

  is_loading = false;
  // pagination things
  total: number = 0;
  @Input() offset: number = 0;
  @Input() limit = 100;
  @Input() totalRows = 0;
  @Input() currentPage: any = 1;

  destroy$: Subject<boolean> = new Subject();
  @Input() url: string = "";
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() error_message: string = "";
  @Input() module = "admin"
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
  @Input() timestamp: string = ""
  @Output() selectionChanged = new EventEmitter();
  @Output() dataDownloaded = new EventEmitter();
  @Input() columnLabels?: { [key: string]: string };
  @Input() rowSelection: "single" | "multiple" | undefined = "multiple"

  @Input() image_keys = ['picture', 'qr_code']

  @Input() selectedItems: any[] = [];
  @Output() onSelect = new EventEmitter();
  @Input() exclusionKeys = ['id', 'created_by', 'modified_on', 'deleted',
    'deleted_by', 'password_hash', 'last_ip']
  showTable: boolean = false;
  @Input() displayedColumns: string[] = [];
  sortColumns: string[] = [];
  // @Input() actions: DataActionsButton[] = [];
  @Input() getActions: (row: any) => DataActionsButton[] = (row: any) => [];
  @Input() searchParam = "";
  selection = new SelectionModel<any>(true, []);
  @Input() withDeleted: boolean = false;
  @Input() preload: boolean = true;
  /**this contains a key-value pair of classnames that should be given to contents of the table cell based
   * on the value of the key. For example, if the key is "status" and the value is "Alive", the classname
   * could be "badge badge-success". This is used in the template. the classnames must exist in the global
   * style.css or be defined perhaps another css file in the assets. it cannot be defined in the component.
   */
  @Input() specialClasses: { [key: string]: string } = {};
  replaceSpaceWithUnderscore = replaceSpaceWithUnderscore;
  @Input() showPagination: boolean = true;
  @Input() showExport: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() showInfo: boolean = true;

  @Input() sortBy: string = "";
  @Input() sortOrder: string = "asc";
  @Input() filters: IFormGenerator[] = [];
  @Input() tableTitle: string = "";
  @ContentChild('header') header!: TemplateRef<any>;
  @ContentChild('selectionOptions') selectionOptions!: TemplateRef<any>;
  @Input() showDeleted: boolean = true;
  @Input() showFilterButton: boolean = true;
  @Input() showSort: boolean = true;
  @Input() hint: string = "";
  @Input() showReset: boolean = true;
  @Input() emitDownload: boolean = false;
  @Input() showPrint: boolean = true;
  /** in some cases the array to display is nested in the data key of the response. this key shows what that key
   *  is
   */
  @Input() dataKey: string = "data";
  /** */
  urlFilterKeys: string[] = [];
  @Input() customClassRules: { [key: string]: (row: any) => boolean } = {};
  @Input() showAllFilters: boolean = false;
  @Input() onFilterSubmitted: (params: string) => void = () => { };
  queryParams: { [key: string]: string } = {};
  isOverflowing: boolean = false;
  @Input() filtersLayout: "vertical" | "horizontal" | "grid" = "horizontal";
  @Input() useResponseFilters: boolean = true;
  @Input() showTableTitle: boolean = true;
  constructor(private dbService: HttpService, private dialog: MatDialog, private ar: ActivatedRoute,
    private router: Router, private datePipe: DatePipe) {
    //if there's a query param, set the searchParam
    const searchQuery = this.ar.snapshot.queryParamMap.get('searchParam');
    if (searchQuery) {
      this.searchParam = searchQuery;
    }

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.selection.changed.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.onSelect.emit(data.source.selected)
    })
    if (this.useResponseFilters) {
      this.ar.queryParams
        .pipe(takeUntil(this.destroy$)).subscribe(params => {
          this.queryParams = params;
          const searchQuery = params['searchParam'];
          //assign the param values to the filters
          this.filters.forEach(filter => {
            if (params[filter.name]) {
              filter.value = params[filter.name];
            }
          })
          if (searchQuery) {
            this.searchParam = searchQuery;
            this.search();
          }
        });
    }

    // Add resize observer to check overflow on container size changes
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        this.checkOverflow();
      });

      // Start observing after view init
      setTimeout(() => {
        if (this.filtersContainer) {
          resizeObserver.observe(this.filtersContainer.nativeElement);
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.searchParam.trim()) {
      this.search();
    }
    this.dataSource.sort = this.sort;
    this.checkOverflow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.preload) {
      this.offset = 0;
      this.currentPage = 1;
      this.getData();
    }
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

  prepUrl(): string {
    let extra = `page=${this.offset}&limit=${this.limit}`;
    if (this.searchParam.trim()) {
      extra += `&param=${this.searchParam}`
    }
    if (this.withDeleted) {
      extra += `&withDeleted=yes`
    }

    //if sorting
    if (this.sortBy) {
      extra += `&sortBy=${this.sortBy}&sortOrder=${this.sortOrder}`
    }
    if (this.filters.length > 0) {
      this.filters.forEach(filter => {

        //add the filter to the url if it's not already in the url query params
        if (filter.value && !this.queryParams[filter.name] && !this.queryParams[`child_${filter.name}`]) {

          extra += filter.type === "date" ? `&${filter.name}=${this.formatDate(filter.value)}` : `&${filter.name}=${filter.value}`
        }
      });
    }
    return this.url.indexOf("?") == -1 ? this.url + '?' + extra : this.url + `&${extra}`;
  }


  getData(url?: string) {
    this.loading = true;
    this.showTable = false;
    if (!url) {
      url = this.prepUrl();
    }
    const splitUrl = url.split("?");
    let tableTitleArray: string[] = [];
    //splitUrl should return a string like param=123&limit=10&page=1. apart from page and limit,
    //split every key=value into key: value, separated by commas.

    const params = splitUrl[1].split("&").filter(param => !param.includes("page=") && !param.includes("limit=")
      && !param.includes("sortBy=") && !param.includes("sortOrder=")).map(x => x.split("="));
    params.map(param => {
      tableTitleArray.push(this.getColumnLabel(param[0]) + ": " + param[1]);
    })
    this.tableTitle = tableTitleArray.join(", ");

    this.dbService.get<ApiResponseObject<any>>(url).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const data: { [key: string]: any }[] = this.dataKey && !isArray(response.data) ? response.data[this.dataKey] : response.data;
          data.map(item => {
            item['actions'] = this.getActions(item);
          })
          if (this.emitDownload) {
            this.dataDownloaded.emit(response);
          }
          this.dataSource = new MatTableDataSource(data);

          this.error = false;
          this.totalRows = response.total;
          this.sortColumns = response.displayColumns;
          this.displayedColumns = ['#'];
          if (this.rowSelection == 'multiple') {
            this.displayedColumns.push('select');
          }
          this.displayedColumns.push(...["actions", ...response.displayColumns])
          this.columnLabels = response.columnLabels
          this.showTable = true;
          this.dataSource.sort = this.sort;
          if (this.useResponseFilters && response.columnFilters && response.columnFilters.length > 0) {
            //merge the filters from the server with the filters from the parent component, preserving the parent component's values
            this.filters = response.columnFilters.map(filter => {
              const existingFilter = this.filters.find(x => x.name == filter.name);
              if (existingFilter) {
                filter.value = existingFilter.value;
              }

              //check if any of the fiter fields is set in the url query params
              if (this.queryParams[filter.name]) {
                filter.value = this.queryParams[filter.name];
              }
              //filters cannot be required
              filter.required = false;
              return filter;
            })

          }
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


  getColumnClass(columnAndValue: string): string {
    return this.specialClasses[columnAndValue] || columnAndValue;
  }

  setFilters(args: IFormGenerator[]) {
    this.filters = args;

    this.getData();
  }

  showFilterDialog() {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      data: {
        title: "Filter",
        fields: this.filters,
        formType: "filter"
      },
      width: '50vw'
    });
    dialogRef.afterClosed().subscribe((result: IFormGenerator[] | false) => {

      if (result) {
        this.setFilters(result);
        //for those that are dates, format them

      }

    });
  }

  showSortDialog() {
    const dialogRef = this.dialog.open(this.sortDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sortBy = result.sortBy;
        this.sortOrder = result.sortOrder;
        this.getData();
      }
    });
  }

  removeFilter(filter: IFormGenerator) {
    filter.value = "";
    this.getData();
  }

  reset() {
    window.location.reload();
  }

  public reload() {
    if (this.preload) {
      this.offset = 0;
      this.currentPage = 1;
      this.getData();
      this.clearSelection();
    }
  }

  public clearSelection() {
    this.selection.clear();
  }

  isLink(content: string | null): boolean {
    return content && typeof content === 'string' ? content.startsWith('http') || content.startsWith('www') : false;
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

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  filterSubmitted(params: string) {
    this.onFilterSubmitted(params);
  }

  /**
   *
   * @param filter the object that contains the filter details
   * @param value the value of the filter
   * @returns the value of the filter in the format that the form generator expects
   */
  parseFilterValue(filter: IFormGenerator, value: any) {
    if (filter.type === "date-range") {
      //change the format of the date to the format that the form generator expects
      const dateRange = value.split(" to ");
      return {
        startDate: this.formatDate(new Date(dateRange[0])),
        endDate: this.formatDate(new Date(dateRange[1]))
      }
    }
    return value;
  }

  checkOverflow() {
    if (this.filtersContainer) {
      const element = this.filtersContainer.nativeElement;
      this.isOverflowing = element.scrollWidth > element.clientWidth;
    }
  }
}
