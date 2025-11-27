import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActionsAuditService, ActionAudit } from 'src/app/core/services/http/actions-audit.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';

@Component({
  selector: 'app-actions-audit',
  templateUrl: './actions-audit.component.html',
  styleUrls: ['./actions-audit.component.scss']
})
export class ActionsAuditComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  url = '/admin/actions-audit';
  selectedAudit: ActionAudit | null = null;
  showDetails = false;

  // Stats
  stats = {
    total: 0,
    by_type: [] as Array<{ action_type: string; count: number }>,
    avg_execution_time_ms: 0,
    daily_stats: [] as Array<{ date: string; count: number }>
  };

  columnLabels = {
    id: 'ID',
    application_uuid: 'Application',
    action_type: 'Action Type',
    execution_time_ms: 'Execution Time (ms)',
    triggered_by: 'Triggered By',
    created_at: 'Created'
  };

  specialClasses = {
    action_type: 'action-type-badge'
  };

  constructor(
    private actionsAuditService: ActionsAuditService,
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
    this.actionsAuditService.getStats()
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
        label: 'Delete',
        icon: 'delete',
        type: 'button',
        onClick: () => this.deleteAudit(row)
      }
    ];
  };

  viewDetails(audit: ActionAudit): void {
    this.selectedAudit = audit;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedAudit = null;
  }

  deleteAudit(audit: ActionAudit): void {
    if (!window.confirm(`Are you sure you want to delete this audit record? This cannot be undone.`)) return;

    this.actionsAuditService.deleteAudit(audit.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notify.successNotification('Audit record deleted successfully');
          this.loadStats();
          // Trigger reload of the list
          window.location.reload();
        },
        error: (error) => {
          this.notify.failNotification('Failed to delete audit record');
        }
      });
  }

  cleanup(): void {
    const days = window.prompt('Delete audit records older than how many days?', '90');
    if (!days) return;

    this.actionsAuditService.cleanup(parseInt(days))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notify.successNotification(response.message);
          this.loadStats();
          // Trigger reload of the list
          window.location.reload();
        },
        error: (error) => {
          this.notify.failNotification('Failed to cleanup audit records');
        }
      });
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  getTopActionTypes(): Array<{ action_type: string; count: number }> {
    return this.stats.by_type.slice(0, 5);
  }
}
