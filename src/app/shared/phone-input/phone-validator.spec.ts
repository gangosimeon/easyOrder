import { FormControl } from '@angular/forms';

import { isValidPhone, phoneNumberValidator } from './phone-validator';

/** Validation du numéro de téléphone (indicatif + numéro local, libphonenumber-js). */
describe('phone-validator', () => {
  it('numéro burkinabè valide accepté, numéro trop court ou vide refusé', () => {
    expect(isValidPhone('226', '70123456')).toBe(true);
    expect(isValidPhone('226', '7012')).toBe(false);
    expect(isValidPhone('226', '')).toBe(false);
  });

  it('validateur de formulaire : vide accepté (champ facultatif), numéro invalide signalé, espaces ignorés', () => {
    const validator = phoneNumberValidator(() => '226');
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl('70 12 34 56'))).toBeNull();
    expect(validator(new FormControl('12'))).toEqual({ invalidPhone: true });
  });
});
