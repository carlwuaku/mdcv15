import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-superintending-history',
  templateUrl: './superintending-history.component.html',
  styleUrls: ['./superintending-history.component.scss']
})
export class SuperintendingHistoryComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    this.setUrl();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['licenseNumber']) {
      this.setUrl();
    }
  }
  @Input() url: string = "licenses/renewal";
  @Input() licenseNumber: string = ""
  licenseMode: boolean = true;

  setUrl() {
    this.url = `licenses/renewal?renewal_practitioner_in_charge=${this.licenseNumber}&license_type=facilities`;
  }
}
