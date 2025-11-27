import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonStringify'
})
export class JsonStringifyPipe implements PipeTransform {

  transform(value: any): string {
    return JSON.stringify(value);
  }

}
