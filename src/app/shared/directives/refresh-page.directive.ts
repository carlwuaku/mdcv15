import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRefreshPage]'
})
export class RefreshPageDirective {
  @HostListener("click")
  onClick(){
    window.location.reload()
  }
  constructor() { }

}
