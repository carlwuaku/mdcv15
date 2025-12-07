import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isJson',
  pure: true
})
export class IsJsonPipe implements PipeTransform {
  transform(content: string): boolean {
    try {
      if (content == null || typeof content !== 'string') {
        return false;
      }

      const parsed = JSON.parse(content);

      // Only return true if it's an object or array
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  }
}
