import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {
  @Input() baseUrl: string = "activities";
  @Input() url: string = "activities";
  ts: string = "";
}
