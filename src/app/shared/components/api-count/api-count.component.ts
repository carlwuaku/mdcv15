import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { shareReplay, catchError, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'app-api-count',
  templateUrl: './api-count.component.html',
  styleUrls: ['./api-count.component.scss']
})
export class ApiCountComponent implements OnInit, OnChanges, OnDestroy {
  @Input() url: string = '';
  @Input() module: string = '';
  count: any = '...';
  loading: boolean = false;
  // the name of the property containing the data from the api
  @Input() property: string = 'count';
  //a type provided for use with the commonly used urls below
  @Input() type: string = '';

  // Static cache to share across all component instances
  private static cache = new Map<string, Observable<any>>();
  // Subject to handle component destruction
  private destroy$ = new Subject<void>();
  // Subject to cancel ongoing requests when URL changes
  private cancelRequest$ = new Subject<void>();

  constructor(private httpService: HttpService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url'] && changes['url'].currentValue !== changes['url'].previousValue) {
      // Cancel any ongoing request for the previous URL
      this.cancelRequest$.next();
      this.getCount();
    }
  }

  ngOnInit(): void {
    this.getCount();
  }

  ngOnDestroy(): void {
    // Cancel any ongoing requests
    this.cancelRequest$.next();
    this.cancelRequest$.complete();

    // Signal component destruction
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCount(): void {
    if (!this.url) {
      this.count = 0;
      return;
    }

    this.loading = true;

    // Check if we already have a cached observable for this URL
    if (!ApiCountComponent.cache.has(this.url)) {
      // Create and cache the observable
      const request$ = this.httpService.get<any>(this.url).pipe(
        takeUntil(this.destroy$), // Cancel request when component is destroyed
        shareReplay(1), // Cache the result and replay it for subsequent subscribers
        catchError(error => {
          console.error('API count error for URL:', this.url, error);
          return of({ data: 0 }); // Return default structure on error
        })
      );

      ApiCountComponent.cache.set(this.url, request$);
    }

    // Subscribe to the cached observable
    ApiCountComponent.cache.get(this.url)!
      .pipe(
        takeUntil(this.cancelRequest$), // Cancel this specific subscription
        takeUntil(this.destroy$) // Also cancel when component is destroyed
      )
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.count = data.data || 0;
        },
        error: () => {
          this.loading = false;
          this.count = 0;
        }
      });
  }

  // Optional: Method to clear cache for specific URL or all URLs
  static clearCache(url?: string): void {
    if (url) {
      ApiCountComponent.cache.delete(url);
    } else {
      ApiCountComponent.cache.clear();
    }
  }

  // Optional: Method to get cache size (for debugging)
  static getCacheSize(): number {
    return ApiCountComponent.cache.size;
  }
}
