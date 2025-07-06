import { Component, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';

export type AlertType = 'info' | 'success' | 'warning' | 'error';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements AfterContentInit {
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Input() message?: string;
  @Input() dismissible: boolean = false;
  @Input() visible: boolean = true;

  @Output() dismissed = new EventEmitter<void>();

  hasContent = false;

  ngAfterContentInit() {
    // Check if there's projected content
    this.hasContent = true;
  }

  dismiss() {
    this.visible = false;
    this.dismissed.emit();
  }
}
