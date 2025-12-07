import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isLinkLoading',
  pure: true
})
export class IsLinkLoadingPipe implements PipeTransform {
  transform(url: string, loadingLinks: Map<string, boolean>): boolean {
    return loadingLinks.get(url) || false;
  }
}
