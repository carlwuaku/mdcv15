import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { MenuItem } from 'src/app/shared/utils/data';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchType: string = "Doctors";
  param: string = "";
  url: string | undefined = "";
  destroy$: Subject<boolean> = new Subject();
  ts: string = "";
  finalUrl: string = "";
  searchTypes: MenuItem[] = [];
  constructor(private ar: ActivatedRoute, private appService: AppService) {

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {


    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.searchTypes = data.searchTypes;
    });
  }


}
