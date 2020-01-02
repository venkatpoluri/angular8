import { Attribute, Directive, forwardRef , ElementRef, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';
@Directive({
  selector: '[range]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => RangeValidatorDirective), multi: true }
  ]
})
export class RangeValidatorDirective {
  private regex: RegExp = new RegExp(/[^0-9]/g);
  private validator: ValidatorFn;

  constructor(@Attribute('range') range: string) {
    const arr = range.split(',');
    let min = 1;
    let max = 10;
    if (arr[0]) { min = parseInt(arr[0], 10); }
    if (arr[1]) { max = parseInt(arr[1], 10); }
    this.validator = this.range(min, max);
  }
  range(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }
  validate(c: AbstractControl): { [key: string]: any } {
    return this.validator(c);
  }
}
