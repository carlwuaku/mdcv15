import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppSettingsService, AppSettingOverride, AvailableKey } from 'src/app/core/services/http/app-settings.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-app-settings-manager',
  templateUrl: './app-settings-manager.component.html',
  styleUrls: ['./app-settings-manager.component.scss']
})
export class AppSettingsManagerComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  fileSettings: { [key: string]: any } = {};
  overrides: AppSettingOverride[] = [];
  availableKeys: AvailableKey[] = [];
  filteredKeys: AvailableKey[] = [];

  loading = false;
  searchTerm = '';

  // For editing
  editMode = false;
  currentOverride: Partial<AppSettingOverride> | null = null;
  selectedKey = '';
  newValue: any = '';
  selectedValueType: 'string' | 'number' | 'boolean' | 'array' | 'object' = 'string';
  selectedMergeStrategy: 'replace' | 'merge' | 'append' | 'prepend' = 'replace';
  description = '';

  displayedColumns: string[] = ['setting_key', 'setting_value', 'value_type', 'merge_strategy', 'updated_at', 'is_active', 'actions'];

  constructor(
    private appSettingsService: AppSettingsService,
    private notify: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.appSettingsService.getAllSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.fileSettings = response.data.fileSettings;
          this.overrides = response.data.overrides;
          this.loading = false;
        },
        error: (error) => {
          this.notify.failNotification('Failed to load settings');
          this.loading = false;
        }
      });

    this.appSettingsService.getAvailableKeys()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.availableKeys = response.data.filter(k => !k.hasChildren); // Only leaf keys
          this.filteredKeys = this.availableKeys;
        },
        error: (error) => {
          this.notify.failNotification('Failed to load available keys');
        }
      });
  }

  filterKeys(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredKeys = this.availableKeys.filter(k =>
      k.key.toLowerCase().includes(term)
    );
  }

  onKeySelected(key: string): void {
    this.selectedKey = key;
    // Get the current value from file settings
    const fileValue = this.getNestedValue(this.fileSettings, key);
    this.selectedValueType = this.detectType(fileValue);

    // Check if there's an existing override
    const existingOverride = this.overrides.find(o => o.setting_key === key);
    if (existingOverride) {
      this.currentOverride = existingOverride;
      this.newValue = this.parseValue(existingOverride.setting_value, existingOverride.value_type);
      this.selectedValueType = existingOverride.value_type;
      this.selectedMergeStrategy = existingOverride.merge_strategy || 'replace';
      this.description = existingOverride.description || '';
    } else {
      this.currentOverride = null;
      this.newValue = fileValue;
      this.selectedMergeStrategy = 'replace';
      this.description = '';
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  detectType(value: any): 'string' | 'number' | 'boolean' | 'array' | 'object' {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'string';
  }

  parseValue(value: string, type: string): any {
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true' || value === '1';
      case 'array':
      case 'object':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  }

  saveOverride(): void {
    if (!this.selectedKey) {
      this.notify.failNotification('Please select a setting key');
      return;
    }

    this.loading = true;

    // Prepare the value
    let valueToSave: string;
    if (this.selectedValueType === 'array' || this.selectedValueType === 'object') {
      valueToSave = typeof this.newValue === 'string' ? this.newValue : JSON.stringify(this.newValue);
    } else {
      valueToSave = String(this.newValue);
    }

    const data: Partial<AppSettingOverride> = {
      setting_key: this.selectedKey,
      setting_value: valueToSave,
      value_type: this.selectedValueType,
      merge_strategy: this.selectedMergeStrategy,
      description: this.description || undefined
    };

    if (this.currentOverride?.id) {
      // Update existing
      this.appSettingsService.updateOverride(this.currentOverride.id, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notify.successNotification('Setting override updated successfully');
            this.loadData();
            this.resetForm();
            this.loading = false;
          },
          error: (error) => {
            this.notify.failNotification('Failed to update setting override');
            this.loading = false;
          }
        });
    } else {
      // Create new
      this.appSettingsService.createOverride(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notify.successNotification('Setting override created successfully');
            this.loadData();
            this.resetForm();
            this.loading = false;
          },
          error: (error) => {
            this.notify.failNotification('Failed to create setting override');
            this.loading = false;
          }
        });
    }
  }

  editOverride(override: AppSettingOverride): void {
    this.selectedKey = override.setting_key;
    this.onKeySelected(override.setting_key);
    this.editMode = true;
  }

  deleteOverride(override: AppSettingOverride): void {
    if (!window.confirm(`Are you sure you want to remove the override for "${override.setting_key}"? The setting will revert to the file value.`)) return;

    if (override.id) {
      this.loading = true;
      this.appSettingsService.deleteOverride(override.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notify.successNotification('Setting override removed successfully');
            this.loadData();
            this.loading = false;
          },
          error: (error) => {
            this.notify.failNotification('Failed to remove setting override');
            this.loading = false;
          }
        });
    }

  }

  toggleActive(override: AppSettingOverride): void {
    if (!override.id) return;

    const newActiveState = !override.is_active;
    this.appSettingsService.updateOverride(override.id, { is_active: newActiveState })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notify.successNotification(`Setting override ${newActiveState ? 'activated' : 'deactivated'}`);
          this.loadData();
        },
        error: (error) => {
          this.notify.failNotification('Failed to update setting override');
        }
      });
  }

  clearCache(): void {
    this.loading = true;
    this.appSettingsService.clearCache()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notify.successNotification('Settings cache cleared successfully');
          this.loading = false;
        },
        error: (error) => {
          this.notify.failNotification('Failed to clear cache');
          this.loading = false;
        }
      });
  }

  resetForm(): void {
    this.selectedKey = '';
    this.newValue = '';
    this.selectedValueType = 'string';
    this.selectedMergeStrategy = 'replace';
    this.description = '';
    this.currentOverride = null;
    this.editMode = false;
  }

  formatValue(value: string, type: string): string {
    if (type === 'array' || type === 'object') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }
    return value;
  }
}
