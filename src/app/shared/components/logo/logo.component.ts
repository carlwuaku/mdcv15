import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    standalone: false
})
export class LogoComponent implements OnInit, OnDestroy {
  logo: string = "";
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private appService: AppService) { }
  ngOnInit(): void {
    this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.logo = data.logo;
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  @Input() height: number = 50;

}
