import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sub-section-container',
  templateUrl: './sub-section-container.component.html',
  styleUrls: ['./sub-section-container.component.scss']
})
export class SubSectionContainerComponent {
  @Input() title: string = 'Section Title';
  @Input() childStyle: string = '';
  @Input() containerStyle: string = '';
}
