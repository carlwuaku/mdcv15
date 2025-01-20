import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy, OnChanges {
  searchType: string = "Doctors";
  param: string = "";
  url: string | undefined = "";
  destroy$: Subject<boolean> = new Subject();
  ts: string = "";
  finalUrl: string = "";
  searchTypes: { label: string, key: string, url: string }[] = [];
  constructor(private ar: ActivatedRoute, private appService: AppService) {

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.ar.queryParams
      .subscribe(params => {
        this.searchType = params['searchType'];
        this.param = params['searchParam'];
        this.ts = params['t'];
        this.updateUrl();
      });

    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.searchTypes = data.searchTypes;
      this.updateUrl();
    });
  }

  updateUrl() {
    this.url = this.searchTypes.find((type: { label: string, key: string, url: string }) => type.key === this.searchType)?.url;
    this.finalUrl = `${this.url}?searchParam=${this.param}&ts=${this.ts}`;
  }


}
