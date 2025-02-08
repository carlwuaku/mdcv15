import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-asset-image',
    templateUrl: './asset-image.component.html',
    styleUrls: ['./asset-image.component.scss'],
    standalone: false
})
export class AssetImageComponent {
  @Input() name!: string
  @Input() height: string = "100";
}
