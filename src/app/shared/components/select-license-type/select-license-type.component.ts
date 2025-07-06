import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { getLabelFromKey } from '../../utils/helper';

@Component({
  selector: 'app-select-license-type',
  templateUrl: './select-license-type.component.html',
  styleUrls: ['./select-license-type.component.scss']
})
export class SelectLicenseTypeComponent implements OnInit, OnDestroy {
  @Input() licenseType: string = "";
  licenseTypes: { key: string, value: string }[] = [];
  destroy$: Subject<boolean> = new Subject();
  @Output() licenseTypeChanged: EventEmitter<string> = new EventEmitter();
  @Input() label: string = "Select license type";
  @Input() emptyOption: string = "Choose one";
  @Input() autoSelectLicenseType: boolean = false;
  constructor(private appService: AppService) {
  }
  ngOnInit(): void {
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.licenseTypes = Object.keys(data.licenseTypes).map(_key => ({ key: getLabelFromKey(_key), value: _key }));

      if (!this.licenseType && this.licenseTypes.length > 0 && this.autoSelectLicenseType) {
        this.licenseType = this.licenseTypes[0]?.value;
        this.licenseTypeChanged.emit(this.licenseTypes[0]?.value)
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  onLicenseTypeChange(event: MatSelectChange) {
    const selectedValue = event.value;
    this.licenseTypeChanged.emit(selectedValue);
  }
}
