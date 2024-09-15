import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-tile',
  templateUrl: './dashboard-tile.component.html',
  styleUrls: ['./dashboard-tile.component.scss']
})
export class DashboardTileComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() link: string = '';
  @Input() linkText: string = '';
  @Input() counterUrl: string = '';
  @Input() counterText: string = '';
  @Input() description: string = '';
}