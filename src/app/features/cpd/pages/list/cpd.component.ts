import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-cpd',
  templateUrl: './cpd.component.html',
  styleUrls: ['./cpd.component.scss']
})
export class CpdComponent implements OnInit {
  queryParams: { [key: string]: string } = {};
  cpdListBaseUrl: string = `cpd/details`;
  cpdListUrl: string = "";
  destroy$: Subject<boolean> = new Subject();
  constructor(private ar: ActivatedRoute) {
  }
  ngOnInit(): void {
    combineLatest([
      this.ar.queryParams,
      this.ar.paramMap
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([queryParams, params]) => {

      this.queryParams = queryParams;
      this.updateCpdListUrl();
    });
  }

  updateCpdListUrl() {
    this.cpdListUrl = `${this.cpdListBaseUrl}?` + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }

  filterChanged(filters: { [key: string]: string }) {
    this.queryParams = { ...filters };
    this.updateCpdListUrl();
  }
}
