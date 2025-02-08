import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-mat-datepicker',
    templateUrl: './mat-datepicker.component.html',
    styleUrls: ['./mat-datepicker.component.scss'],
    standalone: false
})
export class MatDatepickerComponent implements OnChanges {
  @Input() label: string = 'Date';
  @Input() initialDate?: string = undefined;
  date?: Date;
  @Output() onFinish: EventEmitter<string> = new EventEmitter();
  // options = {
  //   dateInput: { dateFormat: 'YYYY/MM/DD' } // Set the desired format here
  // };
  constructor(private datePipe: DatePipe) {


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDate'] && this.initialDate) {
      console.log(this.initialDate, 'initialDate')
      this.date = new Date(this.initialDate);
    }
  }
  onDateChange(event: any) {
    console.log(event.value)

    this.onFinish.emit(this.formatDate(event.value));
    //format the date to be in the format yyyy-mm-dd

  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
