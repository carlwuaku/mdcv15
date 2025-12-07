import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isHtml',
  pure: true
})
export class IsHtmlPipe implements PipeTransform {
  transform(content: string): boolean {
    if (!content || typeof content !== 'string') {
      return false;
    }

    // Check for common HTML tags or entities
    const htmlRegex = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i;
    return htmlRegex.test(content);
  }
}
