import { Component,Input } from '@angular/core';

@Component({
  selector: 'logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  @Input() height: number = 50;

}
