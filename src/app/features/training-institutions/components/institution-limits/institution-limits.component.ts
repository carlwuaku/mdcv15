import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TrainingInstitutionsService, TrainingInstitution, InstitutionLimit } from '../../training-institutions.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
  selector: 'app-institution-limits',
  templateUrl: './institution-limits.component.html',
  styleUrls: ['./institution-limits.component.scss']
})
export class InstitutionLimitsComponent implements OnInit, OnDestroy {
  uuid: string = '';
  institution: TrainingInstitution | null = null;
  limits: InstitutionLimit[] = [];
  loading: boolean = false;
  destroy$: Subject<boolean> = new Subject();

  // Form data
  newYear: string = new Date().getFullYear().toString();
  newLimit: number = 0;
  editingLimit: InstitutionLimit | null = null;

  displayedColumns: string[] = ['year', 'student_limit', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TrainingInstitutionsService,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.uuid = params['uuid'];
      if (this.uuid) {
        this.loadInstitution();
        this.loadLimits();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  loadInstitution(): void {
    this.loading = true;
    this.service.getTrainingInstitution(this.uuid).subscribe({
      next: (response) => {
        this.institution = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading institution:', error);
        this.notify.failNotification('Failed to load training institution');
        this.loading = false;
      }
    });
  }

  loadLimits(): void {
    this.loading = true;
    this.service.getInstitutionLimits(this.uuid).subscribe({
      next: (response) => {
        this.limits = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading limits:', error);
        this.notify.failNotification('Failed to load institution limits');
        this.loading = false;
      }
    });
  }

  addLimit(): void {
    if (!this.newYear || this.newLimit === null || this.newLimit === undefined) {
      this.notify.failNotification('Please enter both year and limit');
      return;
    }

    this.loading = true;
    this.service.setInstitutionLimit(this.uuid, this.newYear, this.newLimit).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.loadLimits();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding limit:', error);
        this.notify.failNotification('Failed to add limit');
        this.loading = false;
      }
    });
  }

  editLimit(limit: InstitutionLimit): void {
    this.editingLimit = { ...limit };
    this.newYear = limit.year;
    this.newLimit = limit.student_limit;
  }

  updateLimit(): void {
    if (!this.editingLimit || !this.newYear || this.newLimit === null || this.newLimit === undefined) {
      this.notify.failNotification('Please enter both year and limit');
      return;
    }

    this.loading = true;
    this.service.setInstitutionLimit(this.uuid, this.newYear, this.newLimit).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.loadLimits();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error updating limit:', error);
        this.notify.failNotification('Failed to update limit');
        this.loading = false;
      }
    });
  }

  deleteLimit(limit: InstitutionLimit): void {
    this.service.deleteInstitutionLimit(this.uuid, limit.year).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.loadLimits();
      },
      error: (error) => {
        console.error('Error deleting limit:', error);
        this.notify.failNotification('Failed to delete limit');
      }
    });
  }

  resetForm(): void {
    this.newYear = new Date().getFullYear().toString();
    this.newLimit = 0;
    this.editingLimit = null;
  }

  cancel(): void {
    this.resetForm();
  }

  goBack(): void {
    this.router.navigate(['/training-institutions']);
  }
}
