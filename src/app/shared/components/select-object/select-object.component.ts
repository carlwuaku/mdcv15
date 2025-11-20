import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, of, take, tap, share } from 'rxjs';
import { DateService } from 'src/app/core/date/date.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { v4 as uuidv4 } from 'uuid';
import { getLabel } from '../../utils/helper';

interface CacheEntry {
  data: any;
  timestamp: number;
}

@Component({
  selector: 'app-select-object',
  templateUrl: './select-object.component.html',
  styleUrls: ['./select-object.component.scss']
})
export class SelectObjectComponent implements OnInit, OnChanges {
  // Static cache shared across all component instances
  private static dataCache = new Map<string, CacheEntry>();
  private static readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
  // Track in-flight requests to prevent duplicate API calls for the same URL
  private static pendingRequests = new Map<string, Observable<any>>();
  @Input() url: string = "";
  @Input() labelProperty: string = "name"; //this can be a comma-separated list of properties
  @Input() keyProperty: string = "id";
  @Input() initialValue: string | string[] = "";
  @Input() type: "search" | "select" | "datalist" = "select";
  isLoaded: boolean = false;
  loading: boolean = false;
  error: boolean = false;
  error_message: string = "";
  objects: any[] = []
  filterText: string = "";
  // Leave empty to search all properties
  @Input() filterProperties: string[] = [];

  // Example: for nested properties use dot notation
  // filterProperties = ['user.name', 'user.email', 'details.description'];

  selectedItem: string | string[] = ""
  @Input() timestamp: string = ""
  @Output() selectionChanged = new EventEmitter();
  @Input() emitObject: boolean = false;

  @Input() selection_mode: "single" | "singles" | "multiple" = "single";
  search_param: string = "";
  dataListId: string = "";
  @Input() fieldLabel: string = "";
  @Input() embedSearchResults: boolean = false;
  searchRan: boolean = false;
  selectedSearchItems: any[] = [];
  getLabel = getLabel;
  @Output() dataDownloaded = new EventEmitter();
  @Input() emitDownload: boolean = false;
  @Input() autoSelectSingleSearchResult: boolean = false;

  constructor(private dbService: HttpService, private dateService: DateService) {

  }

  /**
   * Static method to manually clear the cache
   * Useful for testing or when you need to force a refresh
   */
  public static clearCache(): void {
    SelectObjectComponent.dataCache.clear();
    SelectObjectComponent.pendingRequests.clear();
  }

  /**
   * Static method to clear cache for a specific URL
   */
  public static clearCacheForUrl(url: string): void {
    SelectObjectComponent.dataCache.delete(url);
    SelectObjectComponent.pendingRequests.delete(url);
  }

  /**
   * Static method to get cache statistics
   */
  public static getCacheStats(): { cachedUrls: number, pendingRequests: number } {
    return {
      cachedUrls: SelectObjectComponent.dataCache.size,
      pendingRequests: SelectObjectComponent.pendingRequests.size
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.type === "datalist" && !this.dataListId.trim()) {
      this.dataListId = uuidv4();
    }
    if (((changes['url']?.currentValue !== changes['url']?.previousValue)
      || (changes['type']?.currentValue !== changes['type']?.previousValue))
      && (this.type === "datalist" || this.type === "select")) {
      this.getData();
    }
  }
  ngOnInit(): void {
    // this.getData()
  }

  filterObjects() { }

  updateUrlQueryParamValue(url: string, paramName: string, paramValue: string): string {
    if (url.startsWith("http")) {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, paramValue);
      return urlObj.toString();
    }
    else {
      //treat as a normal string that might contain param-like values
      const regex = new RegExp(`(${paramName}=)([^&]*)`);
      const newUrl = url.replace(regex, `$1${paramValue}`);
      return newUrl;
    }
  }
  getData() {
    this.loading = true;
    //in this case we don't want the page limit to be applied since we want all the data. if no limit was applied, we want 1000
    let url = this.updateUrlQueryParamValue(this.url, "limit", "1000");

    // Check cache first
    const cachedEntry = SelectObjectComponent.dataCache.get(url);
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp) < SelectObjectComponent.CACHE_DURATION_MS) {
      // Use cached data
      this.processData(cachedEntry.data);
      this.loading = false;
      return;
    }

    // Check if there's already a pending request for this URL
    let request$ = SelectObjectComponent.pendingRequests.get(url);

    if (!request$) {
      // Create a new request and share it among all subscribers
      request$ = this.dbService.get<any>(url).pipe(
        tap((data: any) => {
          // Store in cache
          SelectObjectComponent.dataCache.set(url, {
            data: data,
            timestamp: now
          });
          // Remove from pending requests once complete
          SelectObjectComponent.pendingRequests.delete(url);
        }),
        share(), // Share the observable among multiple subscribers
        take(1)
      );

      // Store the pending request
      SelectObjectComponent.pendingRequests.set(url, request$);
    }

    // Subscribe to either the existing or new request
    request$.subscribe({
      next: (data: any) => {
        this.processData(data);
      },
      error: (err) => {
        this.error = true;
        this.isLoaded = false;
        this.error_message = err;
        this.loading = false;
        // Remove from pending requests on error
        SelectObjectComponent.pendingRequests.delete(url);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private processData(data: any): void {
    //in some rare cases the data is returned as the result, not in the data prop
    this.objects = data.data || data;
    if (this.initialValue) {
      this.selectedItem = this.initialValue
    }
    if (this.emitDownload) {
      this.dataDownloaded.emit(this.objects);
    }
    this.isLoaded = true;
    this.error = false;
  }

  selectionMade() {
    if (this.emitObject) {
      const object = this.objects.find((object: any) => object[this.keyProperty] === this.selectedItem);
      this.selectionChanged.emit(object);
    }
    else {
      this.selectionChanged.emit(this.selectedItem);
    }

  }


  search() {
    this.loading = true;
    this.searchRan = false;
    const searchUrl = this.url.includes("?") ? this.url + `&param=${this.search_param}` : this.url + `?param=${this.search_param}`;
    this.dbService.get<any>(searchUrl).pipe(take(1))
      .subscribe({
        next: (data: any) => {
          //in some rare cases the data is returned as the result, not in the data prop
          this.objects = data.data || data;
          if (this.initialValue) {
            this.selectedItem = this.initialValue
          }
          if (this.objects.length === 1 && this.autoSelectSingleSearchResult) {
            if (this.emitObject) {
              this.selectionChanged.emit(this.objects[0]);
            }
            else {
              this.selectionChanged.emit(this.objects[0][this.keyProperty]);
            }
          }
          this.isLoaded = true;
          this.error = false;
          this.searchRan = true;
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.isLoaded = false;
          this.error_message = err;
          this.searchRan = true;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  saveSearchSelection() {
    this.selectionChanged.emit(this.selectedSearchItems);
    this.objects = [];
    this.search_param = "";
  }

  singleItemSelected(object: any) {
    if (this.emitObject) {
      this.selectionChanged.emit(object);
    }
    else {
      this.selectionChanged.emit(object[this.keyProperty]);
    }
    this.objects = [];
    this.search_param = "";
  }



  getValue(object: any) {
    if (typeof object === "object") {
      if (this.keyProperty.includes(",")) {
        const labels = this.keyProperty.split(",").map((prop: string) => object[prop.trim()]).join(" ");
        return labels;
      } else {
        let value = object[this.keyProperty];
        if (value === null || value === undefined) {
          return "--Null--";
        }
        if (typeof value === "object") {
          return JSON.stringify(value);
        }
        if (typeof value === "string" && value.trim() === "") {
          return "--Empty Value--";
        }
        return value;
      }
    }
    else {
      if (object === null || object === undefined) {
        return "--Null--";
      }
      if (typeof object === "string" && object.trim() === "") {
        return "--Empty Value--";
      }
      return object;
    }
  }

  selectAll() {
    if (this.emitObject) {
      this.selectionChanged.emit(this.objects);
    }
    else {
      this.selectedItem = this.objects.filter(object => object[this.keyProperty]).map((object: any) => object[this.keyProperty]);
      this.selectionChanged.emit(this.selectedItem);
    }
  }

  clearSelection() {
    this.selectedItem = [];
    this.selectionChanged.emit(this.selectedItem);
  }

  displayFn = (object: any): string => {
    // Return empty string to keep input clear after selection
    return '';
  }

  onOptionSelected(event: any): void {
    const selectedObject = event.option.value;

    if (this.selection_mode === 'multiple') {
      this.toggleSelection(selectedObject, { checked: true });
    } else {
      this.singleItemSelected(selectedObject);
    }
    this.searchRan = false;
    // Clear the input after selection to allow the autocomplete to close
    setTimeout(() => {
      this.search_param = '';
    }, 0);
  }

  toggleSelection(object: any, event: any): void {
    if (event.checked) {
      if (!this.selectedSearchItems.includes(object)) {
        this.selectedSearchItems.push(object);
      }
    } else {
      this.removeSelection(object);
    }
  }

  isSelected(object: any): boolean {
    return this.selectedSearchItems.includes(object);
  }

  removeSelection(object: any): void {
    const index = this.selectedSearchItems.indexOf(object);
    if (index >= 0) {
      this.selectedSearchItems.splice(index, 1);
    }
  }

  clearSearch(): void {
    this.search_param = '';
    this.objects = [];
  }

  trackByFn(index: number, item: any): any {
    return item.id || item; // Use unique identifier if available
  }


}


