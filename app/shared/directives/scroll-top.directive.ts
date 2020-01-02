import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollTop]'
})
export class ScrollTopDirective {

  @HostListener('click')
  public onClick() {
    if (window && window.pageYOffset) {
      window.scroll(0, 0);
    }
  }

}
