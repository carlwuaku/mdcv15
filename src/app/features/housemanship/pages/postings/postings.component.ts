import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-postings',
  templateUrl: './postings.component.html',
  styleUrls: ['./postings.component.scss']
})
export class PostingsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  queryParams: { [key: string]: string } = {};
  constructor(private ar: ActivatedRoute) { }
  ngOnInit(): void {
    this.ar.queryParams
      .pipe(takeUntil(this.destroy$)).subscribe(params => {

        this.queryParams = params;
      });


  }



  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
