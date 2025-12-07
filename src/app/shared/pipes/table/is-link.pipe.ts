import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isLink',
  pure: true
})
export class IsLinkPipe implements PipeTransform {
  transform(content: string | null): boolean {
    return content && typeof content === 'string'
      ? content.startsWith('http') || content.startsWith('www')
      : false;
  }
}
