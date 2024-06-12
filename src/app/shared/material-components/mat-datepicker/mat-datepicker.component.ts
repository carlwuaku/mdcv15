import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mat-datepicker',
  templateUrl: './mat-datepicker.component.html',
  styleUrls: ['./mat-datepicker.component.scss']
})
export class MatDatepickerComponent {
  @Output() onFinish: EventEmitter<string> = new EventEmitter();
  options = {
    dateInput: { dateFormat: 'YYYY/MM/DD' } // Set the desired format here
  };
  onDateChange(event: any) {
    console.log(event.value)
    this.onFinish.emit(event.value);
    //format the date to be in the format yyyy-mm-dd

  }
}
