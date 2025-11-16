import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-data-loader',
  templateUrl: './data-loader.component.html',
  styleUrls: ['./data-loader.component.scss']
})
export class DataLoaderComponent<T = any> implements OnInit, OnDestroy {
  // Configuration inputs
  @Input() fetchData?: (id: string) => Observable<any>; // Function that returns observable
  @Input() url?: string; // Alternative: direct URL (requires httpService to be passed)
  @Input() httpService?: any; // Service with get method if using URL
  @Input() idParamName: string = 'id'; // Name of the route param to extract
  @Input() extractData?: (response: any) => T; // Optional: How to extract data from response
  @Input() dataKey: string = 'data'; // Key to extract data from response if extractData not provided
  @Input() autoLoad: boolean = true; // Whether to load data automatically on init
  @Input() showLoadingSpinner: boolean = true; // Show global loading spinner
  @Input() showInlineLoader: boolean = true; // Show inline loader in template
  @Input() retryable: boolean = true; // Show retry button on error
  @Input() emptyStateMessage: string = 'No data available';
  @Input() errorMessage: string = 'Error loading data. Please try again.';

  // Template inputs
  @ContentChild('content') contentTemplate!: TemplateRef<any>;
  @ContentChild('loading') loadingTemplate?: TemplateRef<any>;
  @ContentChild('error') errorTemplate?: TemplateRef<any>;
  @ContentChild('empty') emptyTemplate?: TemplateRef<any>;

  // Outputs
  @Output() dataLoaded = new EventEmitter<T | null>();
  @Output() loadError = new EventEmitter<any>();
  @Output() loadComplete = new EventEmitter<void>();

  // State
  id: string | null = null;
  data: T | null = null;
  loading: boolean = false;
  error: boolean = false;
  errorDetails: any = null;
  isEmpty: boolean = false;
  destroy$: Subject<boolean> = new Subject();

  constructor(
    private ar: ActivatedRoute,
    private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
    // Extract ID from route params
    this.ar.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      console.log(params.get(this.idParamName));
      this.id = params.get(this.idParamName);
      if (this.autoLoad && this.id) {
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  loadData(): void {
    if (!this.id) {
      console.warn('No ID available to load data');
      return;
    }

    // Validate that we have a way to fetch data
    if (!this.fetchData && !this.url) {
      console.error('Either fetchData function or url must be provided');
      return;
    }

    if (this.url && !this.httpService) {
      console.error('httpService must be provided when using url');
      return;
    }

    this.resetState();
    this.loading = true;

    if (this.showLoadingSpinner) {
      this.notifyService.showLoading();
    }

    // Get the observable
    let dataObservable: Observable<any>;
    if (this.fetchData) {
      dataObservable = this.fetchData(this.id);
    } else if (this.url && this.httpService) {
      const fullUrl = this.url.includes('?')
        ? `${this.url}&id=${this.id}`
        : `${this.url}/${this.id}`;
      dataObservable = this.httpService.get(fullUrl);
    } else {
      return;
    }

    // Subscribe to the observable
    dataObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        // Extract data using custom function or default key
        if (this.extractData) {
          this.data = this.extractData(response);
        } else {
          this.data = this.dataKey ? response[this.dataKey] : response;
        }
        this.isEmpty = this.checkIfEmpty(this.data);
        this.dataLoaded.emit(this.data);
        if (this.showLoadingSpinner) {
          this.notifyService.hideLoading();
        }
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.error = true;
        this.errorDetails = err;
        this.data = null;
        this.loadError.emit(err);
        if (this.showLoadingSpinner) {
          this.notifyService.hideLoading();
        }
      },
      complete: () => {
        this.loading = false;
        this.loadComplete.emit();
      }
    });
  }

  retry(): void {
    this.loadData();
  }

  private resetState(): void {
    this.error = false;
    this.errorDetails = null;
    this.data = null;
    this.isEmpty = false;
  }

  private checkIfEmpty(data: any): boolean {
    if (!data) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === 'object') return Object.keys(data).length === 0;
    return false;
  }

  // Public method to manually reload data
  public reload(): void {
    this.loadData();
  }
}
