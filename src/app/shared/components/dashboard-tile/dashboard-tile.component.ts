import { Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-tile',
  templateUrl: './dashboard-tile.component.html',
  styleUrls: ['./dashboard-tile.component.scss']
})
export class DashboardTileComponent implements OnChanges {

  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() url: string = '';
  @Input() linkText: string = '';
  @Input() counterUrl?: string = '';
  @Input() counterText?: string = '';
  @Input() description?: string = '';
  @Input() urlParams?: any;
  @Input() variant: "primary" | "secondary" | "white" = "white";
  @ContentChild('count') count!: TemplateRef<any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urlParams']) {
      this.urlParams = { ...this.urlParams, ...changes['urlParams'].currentValue };
    }
  }
}
