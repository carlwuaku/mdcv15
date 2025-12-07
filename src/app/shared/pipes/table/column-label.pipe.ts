import { Pipe, PipeTransform } from '@angular/core';
import { getLabelFromKey } from '../../utils/helper';

@Pipe({
  name: 'columnLabel',
  pure: true
})
export class ColumnLabelPipe implements PipeTransform {
  transform(column: string, columnLabels?: { [key: string]: string }): string {
    if (columnLabels && columnLabels[column]) {
      return columnLabels[column];
    }

    return getLabelFromKey(column, false);
  }
}
