import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnClass',
  pure: true
})
export class ColumnClassPipe implements PipeTransform {
  transform(columnAndValue: string, specialClasses: { [key: string]: string }): string {
    return specialClasses[columnAndValue] || columnAndValue;
  }
}
