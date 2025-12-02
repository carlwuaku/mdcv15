import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FailedActionsService, FailedAction } from 'src/app/core/services/http/failed-actions.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';

@Component({
  selector: 'app-failed-actions-manager',
  templateUrl: './failed-actions-manager.component.html',
  styleUrls: ['./failed-actions-manager.component.scss']
})
export class FailedActionsManagerComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  url = '/admin/failed-actions';
  selectedAction: FailedAction | null = null;
  showDetails = false;

  // Stats
  stats = {
    failed: 0,
    retrying: 0,
    resolved: 0,
    total: 0
  };

  columnLabels = {
    id: 'ID',
    application_uuid: 'Application',
    action_type: 'Action Type',
    error_message: 'Error Message',
    status: 'Status',
    retry_count: 'Retries',
    created_at: 'Created'
  };

  specialClasses = {
    status: 'status-badge'
  };

  constructor(
    private failedActionsService: FailedActionsService,
    private notify: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats(): void {
    this.failedActionsService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats = response.data;
        },
        error: (error) => {
          console.error('Failed to load stats', error);
        }
      });
  }

  getActions = (row: any): DataActionsButton[] => {
    return [
      {
        label: 'View Details',
        icon: 'visibility',
        type: 'button',
        onClick: () => this.viewDetails(row)
      },
      {
        label: 'Retry',
        icon: 'refresh',
        type: 'button',
        onClick: () => this.retryAction(row),
        disabled: row.status === 'resolved'
      },
      {
        label: 'Delete',
        icon: 'delete',
        type: 'button',
        onClick: () => this.deleteAction(row)
      }
    ];
  };

  viewDetails(action: FailedAction): void {
    this.selectedAction = action;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedAction = null;
  }

  retryAction(action: FailedAction): void {
    if (!window.confirm(`Are you sure you want to retry this action?`)) return;

    this.failedActionsService.retryAction(action.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.notify.successNotification('Action retried successfully and marked as resolved');
          } else {
            this.notify.failNotification('Retry failed: ' + response.message);
          }
          this.loadStats();
          // Trigger reload of the list
          window.location.reload();
        },
        error: (error) => {
          this.notify.failNotification('Failed to retry action');
        }
      });
  }

  deleteAction(action: FailedAction): void {
    if (!window.confirm(`Are you sure you want to delete this failed action record? This cannot be undone.`)) return;

    this.failedActionsService.deleteAction(action.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notify.successNotification('Failed action deleted successfully');
          this.loadStats();
          // Trigger reload of the list
          window.location.reload();
        },
        error: (error) => {
          this.notify.failNotification('Failed to delete action');
        }
      });
  }

  cleanup(): void {
    const days = window.prompt('Delete resolved actions older than how many days?', '30');
    if (!days) return;

    this.failedActionsService.cleanup(parseInt(days))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notify.successNotification(response.message);
          this.loadStats();
          // Trigger reload of the list
          window.location.reload();
        },
        error: (error) => {
          this.notify.failNotification('Failed to cleanup actions');
        }
      });
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }
}
