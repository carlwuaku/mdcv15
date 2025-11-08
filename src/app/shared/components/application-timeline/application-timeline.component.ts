import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ApplicationTimelineService } from 'src/app/features/application-forms/services/application-timeline.service';
import {
  ApplicationTimelineEntry,
  ApplicationStatusHistory,
  TimelineQueryParams,
  ApplicationActionsResults
} from 'src/app/features/application-forms/models/application-timeline.model';

@Component({
  selector: 'app-application-timeline',
  templateUrl: './application-timeline.component.html',
  styleUrls: ['./application-timeline.component.scss']
})
export class ApplicationTimelineComponent implements OnInit, OnChanges {
  @Input() applicationUuid!: string;
  @Input() viewMode: 'full' | 'compact' = 'full';
  @Input() isPortal: boolean = false;
  @Input() limit: number = 50;

  timelineEntries: ApplicationTimelineEntry[] = [];
  statusHistory: ApplicationStatusHistory[] = [];
  loading: boolean = false;
  error: string | null = null;
  total: number = 0;
  offset: number = 0;
  expandedEntries: Set<number> = new Set();

  constructor(private timelineService: ApplicationTimelineService) { }

  ngOnInit(): void {
    this.loadTimeline();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['applicationUuid'] && !changes['applicationUuid'].firstChange) {
      this.loadTimeline();
    }
  }

  loadTimeline(): void {
    if (!this.applicationUuid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const params: TimelineQueryParams = {
      limit: this.limit,
      offset: this.offset,
      orderDir: 'DESC'
    };

    const request = this.isPortal
      ? this.timelineService.getPortalTimeline(this.applicationUuid, params)
      : this.timelineService.getTimeline(this.applicationUuid, params);

    request.subscribe({
      next: (response) => {
        this.timelineEntries = response.data;
        this.total = response.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading timeline:', err);
        this.error = 'Failed to load application timeline';
        this.loading = false;
      }
    });
  }

  loadStatusHistory(): void {
    if (!this.applicationUuid) {
      return;
    }

    const request = this.isPortal
      ? this.timelineService.getPortalStatusHistory(this.applicationUuid)
      : this.timelineService.getStatusHistory(this.applicationUuid);

    request.subscribe({
      next: (response) => {
        this.statusHistory = response.data;
      },
      error: (err) => {
        console.error('Error loading status history:', err);
      }
    });
  }

  toggleExpand(entryId: number): void {
    if (this.expandedEntries.has(entryId)) {
      this.expandedEntries.delete(entryId);
    } else {
      this.expandedEntries.add(entryId);
    }
  }

  isExpanded(entryId: number): boolean {
    return this.expandedEntries.has(entryId);
  }

  getStatusIcon(status: string): string {
    const statusLower = status?.toLowerCase() || '';

    if (statusLower.includes('approved') || statusLower.includes('completed')) {
      return 'check_circle';
    } else if (statusLower.includes('reject') || statusLower.includes('denied')) {
      return 'cancel';
    } else if (statusLower.includes('pending')) {
      return 'schedule';
    } else if (statusLower.includes('review')) {
      return 'visibility';
    } else {
      return 'info';
    }
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';

    if (statusLower.includes('approved') || statusLower.includes('completed')) {
      return 'status-success';
    } else if (statusLower.includes('reject') || statusLower.includes('denied')) {
      return 'status-error';
    } else if (statusLower.includes('pending')) {
      return 'status-warning';
    } else if (statusLower.includes('review')) {
      return 'status-info';
    } else {
      return 'status-default';
    }
  }

  getActionIcon(actionType: string): string {
    const typeLower = actionType?.toLowerCase() || '';

    if (typeLower.includes('email')) {
      return 'email';
    } else if (typeLower.includes('license') || typeLower.includes('create')) {
      return 'add_circle';
    } else if (typeLower.includes('update')) {
      return 'edit';
    } else if (typeLower.includes('delete')) {
      return 'delete';
    } else if (typeLower.includes('api') || typeLower.includes('http')) {
      return 'api';
    } else {
      return 'settings';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  formatRelativeTime(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return this.formatDate(dateString);
  }

  loadMore(): void {
    this.offset += this.limit;
    this.loadTimeline();
  }

  refresh(): void {
    this.offset = 0;
    this.loadTimeline();
  }

  hasSubmittedData(entry: ApplicationTimelineEntry): boolean {
    return entry.submitted_data != null && Object.keys(entry.submitted_data).length > 0;
  }

  hasActionsResults(entry: ApplicationTimelineEntry): boolean {
    return entry.actions_results != null &&
      entry.actions_results.actions != null &&
      entry.actions_results.actions.length > 0;
  }

  getSubmittedDataKeys(entry: ApplicationTimelineEntry): string[] {
    if (!entry.submitted_data) return [];
    return Object.keys(entry.submitted_data);
  }

  getSuccessCount(actionsResults: ApplicationActionsResults | null): number {
    if (!actionsResults || !actionsResults.actions) return 0;
    return actionsResults.actions.filter(r => r.success).length;
  }

  getFailureCount(actionsResults: ApplicationActionsResults | null): number {
    if (!actionsResults || !actionsResults.actions) return 0;
    return actionsResults.actions.filter(r => !r.success).length;
  }
}
