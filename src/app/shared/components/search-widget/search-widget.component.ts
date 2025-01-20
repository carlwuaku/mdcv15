import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit, OnDestroy {
  types: { label: string, key: string, url: string }[] = [];
  @Input() param: string = "";
  @Input() searchType: string = "Doctors";
  destroy$: Subject<boolean> = new Subject();
  constructor(private router: Router, private ar: ActivatedRoute, private appService: AppService) {

    ar.queryParams
      .subscribe(params => {
        this.searchType = params['searchType'];
        this.param = params['searchParam'];
      });


  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.types = data.searchTypes;
    });
  }

  submit() {

    this.router.navigate(['/search'], {
      queryParams:
        { searchParam: this.param, searchType: this.searchType, t: Date.now() }
    });


  }
}
