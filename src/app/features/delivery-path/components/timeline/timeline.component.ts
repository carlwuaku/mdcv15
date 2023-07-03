import { Component, OnInit, Input } from '@angular/core';
import { ITimeline } from './timeline.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
 @Input() list: ITimeline[] = []

  constructor(){}
  ngOnInit(): void {
  }
}
