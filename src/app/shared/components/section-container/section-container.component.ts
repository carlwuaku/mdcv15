import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss']
})
export class SectionContainerComponent {
  @Input() title: string = 'Section Title';
  @Input() childStyle: string = '';
  @Input() containerStyle: string = '';
}
