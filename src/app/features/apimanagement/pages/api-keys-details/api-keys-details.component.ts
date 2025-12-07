import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiKey, ApiKeyStats } from '../../models/api-key.model';
import { ApiManagementService } from '../../apimanagement.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-api-keys-details',
  templateUrl: './api-keys-details.component.html',
  styleUrls: ['./api-keys-details.component.scss']
})
export class ApiKeysDetailsComponent implements OnInit, OnDestroy {
  id: string;
  apiKey!: ApiKey;
  stats!: ApiKeyStats;
  logs: any[] = [];
  documentation: any;
  isLoading: boolean = false;
  errorLoadingData: boolean = false;
  destroy$: Subject<boolean> = new Subject();
  selectedTab: number = 0;

  constructor(
    private apiManagementService: ApiManagementService,
    private notify: NotifyService,
    private ar: ActivatedRoute,
    private router: Router
  ) {
    this.id = ar.snapshot.params['id'];
  }

  ngOnInit() {
    this.getDetails();
    this.getStats();
    this.getLogs();
  }

  getDetails() {
    this.isLoading = true;
    this.errorLoadingData = false;

    this.apiManagementService.getApiKey(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.apiKey = data;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.errorLoadingData = true;
        this.notify.failNotification('Failed to load API key details');
      }
    });
  }

  getStats() {
    this.apiManagementService.getApiKeyStats(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.stats = data;
      },
      error: error => {
        console.error('Failed to load stats', error);
      }
    });
  }

  getLogs() {
    this.apiManagementService.getApiKeyLogs(this.id, 50).pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.logs = data.data;
      },
      error: error => {
        console.error('Failed to load logs', error);
      }
    });
  }

  getDocumentation() {
    if (this.documentation) return; // Already loaded

    this.apiManagementService.getApiKeyDocumentation(this.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.documentation = data;
      },
      error: error => {
        this.notify.failNotification('Failed to load documentation');
      }
    });
  }

  revokeKey() {
    const reason = window.prompt('Enter reason for revoking this API key:');
    if (!reason) {
      return;
    }

    this.apiManagementService.revokeApiKey(this.id, reason).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.getDetails();
      },
      error: error => {
        this.notify.failNotification(error?.error?.message || 'Failed to revoke API key');
      }
    });
  }

  rotateKey() {
    if (!window.confirm('Are you sure you want to rotate the credentials? The old credentials will stop working immediately.')) {
      return;
    }

    this.apiManagementService.rotateApiKey(this.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        if (response.warning && response.data.key_secret) {
          alert(`${response.warning}\n\nNew Key Secret: ${response.data.key_secret}`);
        }
        this.getDetails();
      },
      error: error => {
        this.notify.failNotification(error?.error?.message || 'Failed to rotate API key');
      }
    });
  }

  editKey() {
    this.router.navigate(['/apimanagement/api-keys-form', this.id]);
  }

  onTabChange(index: number) {
    this.selectedTab = index;
    if (index === 3 && !this.documentation) {
      this.getDocumentation();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
