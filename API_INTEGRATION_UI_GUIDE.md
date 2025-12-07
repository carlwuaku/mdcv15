# API Integration UI Implementation Guide

## Overview
This guide provides detailed instructions for implementing the Angular UI for the API Integration system in the mdcv15 admin portal.

## Directory Structure to Create

```
src/app/features/admin/api-integration/
├── api-integration-routing.module.ts
├── api-integration.module.ts
├── services/
│   ├── institutions.service.ts
│   └── api-keys.service.ts
├── models/
│   ├── institution.model.ts
│   └── api-key.model.ts
├── pages/
│   ├── institutions-list/
│   │   ├── institutions-list.component.ts
│   │   ├── institutions-list.component.html
│   │   └── institutions-list.component.scss
│   ├── institution-form/
│   │   ├── institution-form.component.ts
│   │   ├── institution-form.component.html
│   │   └── institution-form.component.scss
│   ├── api-keys-list/
│   │   ├── api-keys-list.component.ts
│   │   ├── api-keys-list.component.html
│   │   └── api-keys-list.component.scss
│   ├── api-key-form/
│   │   ├── api-key-form.component.ts
│   │   ├── api-key-form.component.html
│   │   └── api-key-form.component.scss
│   ├── api-key-details/
│   │   ├── api-key-details.component.ts
│   │   ├── api-key-details.component.html
│   │   └── api-key-details.component.scss
│   └── integration-documentation/
│       ├── integration-documentation.component.ts
│       ├── integration-documentation.component.html
│       └── integration-documentation.component.scss
└── components/
    ├── key-credentials-dialog/
    │   ├── key-credentials-dialog.component.ts
    │   ├── key-credentials-dialog.component.html
    │   └── key-credentials-dialog.component.scss
    └── key-stats-widget/
        ├── key-stats-widget.component.ts
        ├── key-stats-widget.component.html
        └── key-stats-widget.component.scss
```

## Step 1: Create Module and Routing

### api-integration-routing.module.ts
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionsListComponent } from './pages/institutions-list/institutions-list.component';
import { InstitutionFormComponent } from './pages/institution-form/institution-form.component';
import { ApiKeysListComponent } from './pages/api-keys-list/api-keys-list.component';
import { ApiKeyFormComponent } from './pages/api-key-form/api-key-form.component';
import { ApiKeyDetailsComponent } from './pages/api-key-details/api-key-details.component';
import { IntegrationDocumentationComponent } from './pages/integration-documentation/integration-documentation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'institutions',
    pathMatch: 'full'
  },
  {
    path: 'institutions',
    component: InstitutionsListComponent,
    data: { title: 'Institutions' }
  },
  {
    path: 'institutions/new',
    component: InstitutionFormComponent,
    data: { title: 'New Institution', mode: 'create' }
  },
  {
    path: 'institutions/:id/edit',
    component: InstitutionFormComponent,
    data: { title: 'Edit Institution', mode: 'edit' }
  },
  {
    path: 'api-keys',
    component: ApiKeysListComponent,
    data: { title: 'API Keys' }
  },
  {
    path: 'api-keys/new',
    component: ApiKeyFormComponent,
    data: { title: 'Generate API Key', mode: 'create' }
  },
  {
    path: 'api-keys/:id',
    component: ApiKeyDetailsComponent,
    data: { title: 'API Key Details' }
  },
  {
    path: 'api-keys/:id/documentation',
    component: IntegrationDocumentationComponent,
    data: { title: 'Integration Documentation' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiIntegrationRoutingModule { }
```

### api-integration.module.ts
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ApiIntegrationRoutingModule } from './api-integration-routing.module';

// Services
import { InstitutionsService } from './services/institutions.service';
import { ApiKeysService } from './services/api-keys.service';

// Pages
import { InstitutionsListComponent } from './pages/institutions-list/institutions-list.component';
import { InstitutionFormComponent } from './pages/institution-form/institution-form.component';
import { ApiKeysListComponent } from './pages/api-keys-list/api-keys-list.component';
import { ApiKeyFormComponent } from './pages/api-key-form/api-key-form.component';
import { ApiKeyDetailsComponent } from './pages/api-key-details/api-key-details.component';
import { IntegrationDocumentationComponent } from './pages/integration-documentation/integration-documentation.component';

// Components
import { KeyCredentialsDialogComponent } from './components/key-credentials-dialog/key-credentials-dialog.component';
import { KeyStatsWidgetComponent } from './components/key-stats-widget/key-stats-widget.component';

@NgModule({
  declarations: [
    InstitutionsListComponent,
    InstitutionFormComponent,
    ApiKeysListComponent,
    ApiKeyFormComponent,
    ApiKeyDetailsComponent,
    IntegrationDocumentationComponent,
    KeyCredentialsDialogComponent,
    KeyStatsWidgetComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ApiIntegrationRoutingModule
  ],
  providers: [
    InstitutionsService,
    ApiKeysService
  ]
})
export class ApiIntegrationModule { }
```

## Step 2: Create Services

### services/institutions.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {
  private baseUrl = `${environment.apiUrl}/api-integration/institutions`;

  constructor(private http: HttpClient) { }

  getInstitutions(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(this.baseUrl, { params: httpParams });
  }

  getInstitutionsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }

  getInstitution(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getFormFields(): Observable<any> {
    return this.http.get(`${this.baseUrl}/form-fields`);
  }

  createInstitution(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateInstitution(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteInstitution(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
```

### services/api-keys.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysService {
  private baseUrl = `${environment.apiUrl}/api-integration/api-keys`;

  constructor(private http: HttpClient) { }

  getApiKeys(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(this.baseUrl, { params: httpParams });
  }

  getApiKey(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getFormFields(): Observable<any> {
    return this.http.get(`${this.baseUrl}/form-fields`);
  }

  getAvailablePermissions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/permissions`);
  }

  createApiKey(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateApiKey(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  updatePermissions(id: string, permissions: string[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/permissions`, { permissions });
  }

  revokeApiKey(id: string, reason: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/revoke`, { reason });
  }

  rotateApiKey(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/rotate`, {});
  }

  deleteApiKey(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getStats(id: string, startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    return this.http.get(`${this.baseUrl}/${id}/stats`, { params });
  }

  getLogs(id: string, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get(`${this.baseUrl}/${id}/logs`, { params });
  }

  getDocumentation(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/documentation`);
  }
}
```

## Step 3: Create Models

### models/institution.model.ts
```typescript
export interface Institution {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person_name?: string;
  contact_person_email?: string;
  contact_person_phone?: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
  ip_whitelist?: string[];
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  api_key_count?: number;
}
```

### models/api-key.model.ts
```typescript
export interface ApiKey {
  id: string;
  institution_id: string;
  institution_name?: string;
  name: string;
  key_id: string;
  last_4_secret: string;
  status: 'active' | 'revoked' | 'expired';
  expires_at?: string;
  last_used_at?: string;
  last_used_ip?: string;
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  scopes?: any;
  allowed_endpoints?: string[];
  metadata?: any;
  revoked_at?: string;
  revoked_by?: number;
  revocation_reason?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  permissions?: string[];
}

export interface ApiKeyStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time_ms: number;
  max_response_time_ms: number;
  min_response_time_ms: number;
}

export interface ApiRequestLog {
  id: number;
  api_key_id: string;
  institution_id: string;
  request_id: string;
  method: string;
  endpoint: string;
  response_status: number;
  response_time_ms?: number;
  ip_address: string;
  user_agent?: string;
  error_message?: string;
  created_at: string;
}
```

## Step 4: Implement Institutions List Page

### pages/institutions-list/institutions-list.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstitutionsService } from '../../services/institutions.service';

@Component({
  selector: 'app-institutions-list',
  templateUrl: './institutions-list.component.html',
  styleUrls: ['./institutions-list.component.scss']
})
export class InstitutionsListComponent implements OnInit {
  dataUrl = 'api-integration/institutions';

  actions = [
    {
      label: 'View',
      icon: 'visibility',
      action: (row: any) => this.viewInstitution(row)
    },
    {
      label: 'Edit',
      icon: 'edit',
      action: (row: any) => this.editInstitution(row)
    },
    {
      label: 'API Keys',
      icon: 'vpn_key',
      action: (row: any) => this.viewApiKeys(row)
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: (row: any) => this.deleteInstitution(row),
      color: 'warn'
    }
  ];

  constructor(
    private router: Router,
    private institutionsService: InstitutionsService
  ) { }

  ngOnInit(): void { }

  createNew(): void {
    this.router.navigate(['/admin/api-integration/institutions/new']);
  }

  viewInstitution(row: any): void {
    // Implement view details
    console.log('View institution:', row);
  }

  editInstitution(row: any): void {
    this.router.navigate(['/admin/api-integration/institutions', row.id, 'edit']);
  }

  viewApiKeys(row: any): void {
    this.router.navigate(['/admin/api-integration/api-keys'], {
      queryParams: { institution_id: row.id }
    });
  }

  deleteInstitution(row: any): void {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      this.institutionsService.deleteInstitution(row.id).subscribe({
        next: () => {
          alert('Institution deleted successfully');
          // Refresh list
        },
        error: (error) => {
          alert('Failed to delete institution: ' + error.message);
        }
      });
    }
  }
}
```

### pages/institutions-list/institutions-list.component.html
```html
<div class="page-container">
  <div class="page-header">
    <h1>Institutions</h1>
    <button mat-raised-button color="primary" (click)="createNew()">
      <mat-icon>add</mat-icon>
      New Institution
    </button>
  </div>

  <app-load-data-list
    [dataUrl]="dataUrl"
    [actions]="actions"
    [showSearch]="true"
    [showFilters]="true"
  ></app-load-data-list>
</div>
```

## Step 5: Implement Institution Form

### pages/institution-form/institution-form.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitutionsService } from '../../services/institutions.service';

@Component({
  selector: 'app-institution-form',
  templateUrl: './institution-form.component.html',
  styleUrls: ['./institution-form.component.scss']
})
export class InstitutionFormComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  institutionId?: string;
  formFields: any[] = [];
  initialData: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private institutionsService: InstitutionsService
  ) { }

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] || 'create';
    this.institutionId = this.route.snapshot.paramMap.get('id') || undefined;

    this.loadFormFields();

    if (this.mode === 'edit' && this.institutionId) {
      this.loadInstitution();
    } else {
      this.loading = false;
    }
  }

  loadFormFields(): void {
    this.institutionsService.getFormFields().subscribe({
      next: (fields) => {
        this.formFields = fields;
      },
      error: (error) => {
        console.error('Failed to load form fields:', error);
      }
    });
  }

  loadInstitution(): void {
    this.institutionsService.getInstitution(this.institutionId!).subscribe({
      next: (data) => {
        this.initialData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load institution:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(formData: any): void {
    const operation = this.mode === 'create'
      ? this.institutionsService.createInstitution(formData)
      : this.institutionsService.updateInstitution(this.institutionId!, formData);

    operation.subscribe({
      next: (response) => {
        alert(`Institution ${this.mode === 'create' ? 'created' : 'updated'} successfully`);
        this.router.navigate(['/admin/api-integration/institutions']);
      },
      error: (error) => {
        alert(`Failed to ${this.mode} institution: ` + error.error?.message);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/api-integration/institutions']);
  }
}
```

### pages/institution-form/institution-form.component.html
```html
<div class="page-container">
  <div class="page-header">
    <h1>{{ mode === 'create' ? 'New Institution' : 'Edit Institution' }}</h1>
  </div>

  <mat-card *ngIf="!loading">
    <mat-card-content>
      <app-form-generator
        [formFields]="formFields"
        [initialData]="initialData"
        [submitButtonText]="mode === 'create' ? 'Create' : 'Update'"
        (formSubmit)="onSubmit($event)"
        (formCancel)="onCancel()"
      ></app-form-generator>
    </mat-card-content>
  </mat-card>

  <div *ngIf="loading" class="loading-container">
    <mat-spinner></mat-spinner>
  </div>
</div>
```

## Step 6: Implement API Keys List

### pages/api-keys-list/api-keys-list.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiKeysService } from '../../services/api-keys.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-api-keys-list',
  templateUrl: './api-keys-list.component.html',
  styleUrls: ['./api-keys-list.component.scss']
})
export class ApiKeysListComponent implements OnInit {
  dataUrl = 'api-integration/api-keys';
  institutionId?: string;

  actions = [
    {
      label: 'Details',
      icon: 'info',
      action: (row: any) => this.viewDetails(row)
    },
    {
      label: 'Documentation',
      icon: 'description',
      action: (row: any) => this.viewDocumentation(row)
    },
    {
      label: 'Revoke',
      icon: 'block',
      action: (row: any) => this.revokeKey(row),
      color: 'warn',
      condition: (row: any) => row.status === 'active'
    },
    {
      label: 'Rotate',
      icon: 'sync',
      action: (row: any) => this.rotateKey(row),
      condition: (row: any) => row.status === 'active'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiKeysService: ApiKeysService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.institutionId = params['institution_id'];
      if (this.institutionId) {
        this.dataUrl = `api-integration/api-keys?institution_id=${this.institutionId}`;
      }
    });
  }

  createNew(): void {
    this.router.navigate(['/admin/api-integration/api-keys/new']);
  }

  viewDetails(row: any): void {
    this.router.navigate(['/admin/api-integration/api-keys', row.id]);
  }

  viewDocumentation(row: any): void {
    this.router.navigate(['/admin/api-integration/api-keys', row.id, 'documentation']);
  }

  revokeKey(row: any): void {
    const reason = prompt('Enter reason for revocation:');
    if (reason) {
      this.apiKeysService.revokeApiKey(row.id, reason).subscribe({
        next: () => {
          alert('API key revoked successfully');
          // Refresh list
        },
        error: (error) => {
          alert('Failed to revoke API key: ' + error.message);
        }
      });
    }
  }

  rotateKey(row: any): void {
    if (confirm('Rotate API key credentials? The old credentials will stop working immediately.')) {
      this.apiKeysService.rotateApiKey(row.id).subscribe({
        next: (response) => {
          // Show new credentials dialog
          alert('Key rotated successfully. Save new credentials: ' + JSON.stringify(response.data));
        },
        error: (error) => {
          alert('Failed to rotate API key: ' + error.message);
        }
      });
    }
  }
}
```

## Step 7: Update Admin Routing

Add to `admin-routing.module.ts`:
```typescript
{
  path: 'api-integration',
  loadChildren: () => import('./api-integration/api-integration.module')
    .then(m => m.ApiIntegrationModule),
  data: { title: 'API Integration' }
}
```

## Step 8: Add Navigation Menu Item

Add to your admin navigation menu:
```typescript
{
  label: 'API Integration',
  icon: 'api',
  route: '/admin/api-integration',
  permission: 'View_Institutions'
}
```

## Quick Implementation Checklist

1. ✅ Create directory structure
2. ✅ Create module and routing files
3. ✅ Implement services
4. ✅ Create models/interfaces
5. ✅ Implement institutions list (uses load-data-list)
6. ✅ Implement institution form (uses form-generator)
7. ✅ Implement API keys list (uses load-data-list)
8. ✅ Implement API key form (uses form-generator)
9. ✅ Implement API key details page
10. ✅ Implement documentation viewer
11. ✅ Create credentials display dialog
12. ✅ Create stats widget
13. ✅ Update admin routing
14. ✅ Add navigation menu item

## Testing Steps

1. Run migrations on backend
2. Assign permissions to admin user
3. Navigate to `/admin/api-integration/institutions`
4. Create a test institution
5. Generate an API key for the institution
6. View documentation
7. Test HMAC request from external tool
8. Monitor logs and stats

This structure follows your existing patterns with `form-generator` and `load-data-list` components!
