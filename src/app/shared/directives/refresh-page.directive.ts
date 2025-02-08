import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appRefreshPage]',
    standalone: false
})
export class RefreshPageDirective {
  @HostListener("click")
  onClick(){
    window.location.reload()
  }
  constructor() { }

}
