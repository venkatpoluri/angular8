import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';



/** Error when invalid control is dirty, touched, or submitted. */
//export class MyErrorStateMatcher implements ErrorStateMatcher {
//  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//    const isSubmitted = form && form.submitted;
//    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//  }
//}
export class ErrorMatchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
/**
 * Custom validator functions for reactive form validation
 */
export class CustomValidators {
  /**
   * Validates that child controls in the form group are equal
   */
  static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
    const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {});
    const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value);
    return isValid ? null : { childrenNotEqual: true };
  }
}

/**
 * Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
 */
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.parent.invalid && control.touched;
  }
}

/**
* Collection of reusable RegExps
*/
export const regExps: { [key: string]: RegExp } = {
  password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
};

/**
 * Collection of reusable error messages
 */
export const errorMessages: { [key: string]: string } = {
  name: 'Name must be between 1 and 128 characters',
  userrole: 'UserType is required',
  status:'Status is required',
  emailid: 'Enter valid email address.',
  mobileno: 'Mobile no should have 11 digits',
  loginid:'Login ID is required',
  confirmEmail: 'Email addresses must match',
  password: 'Password must be between 7 and 15 characters, and contain at least one number and special character',
  confirmPassword: 'Passwords must match'
};
