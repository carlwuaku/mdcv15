import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lvisUTCDate'
})
export class LvisUTCDatePipe implements PipeTransform {
  /**
   * this pipe can be used to get the actual UTC date from lvis data. in cases where the date is e.g. 24-05-2023 23:45:00 
   * it is auto converted to 25-05-2023 if the timezone is +01:00. it can be chained to the loxamdate pipe in the ui
   * @param value the date string 
   * @param args 
   * @returns 
   */
  transform(value: string | Date, ...args: unknown[]): Date {
    if (!value) {
      return new Date(0)
    }
    const current = new Date(value);

    const year = current.getUTCFullYear();

    const month = current.getUTCMonth();

    const date = current.getUTCDate();

    const hour = current.getUTCHours();

    const minute = current.getUTCMinutes();

    const seconds = current.getUTCSeconds();

    const newDate = new Date(year, month, date, hour, minute, seconds);

    return newDate;


  }

}
