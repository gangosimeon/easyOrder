import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidPhoneNumber } from 'libphonenumber-js';

export function isValidPhone(dialCode: string, localPhone: string): boolean {
  if (!localPhone) return false;
  try {
    return isValidPhoneNumber(`+${dialCode}${localPhone}`);
  } catch {
    return false;
  }
}

export function phoneNumberValidator(getDialCode: () => string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const local = (control.value ?? '').replace(/\D/g, '');
    if (!local) return null;
    return isValidPhone(getDialCode(), local) ? null : { invalidPhone: true };
  };
}
