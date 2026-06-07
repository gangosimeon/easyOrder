import {
  Component, signal, computed, output,
  inject, ElementRef, HostListener, forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COUNTRIES, Country } from './countries';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss',
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PhoneInputComponent),
    multi:       true,
  }],
})
export class PhoneInputComponent implements ControlValueAccessor {
  private el = inject(ElementRef);

  readonly countries = COUNTRIES;

  readonly selectedCountry = signal<Country>(COUNTRIES[0]);
  readonly localPhone      = signal('');
  readonly showDropdown    = signal(false);
  readonly searchQuery     = signal('');
  readonly isDisabled      = signal(false);

  readonly countryCodeChange = output<string>();

  readonly filteredCountries = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.countries;
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  readonly fullPhonePreview = computed(() => {
    const p = this.localPhone();
    return p ? `+${this.selectedCountry().dialCode} ${p}` : '';
  });

  private onChange  = (_: string) => {};
  onTouched         = () => {};

  writeValue(val: string): void {
    this.localPhone.set(val ?? '');
  }

  registerOnChange(fn: (_: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void          { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void         { this.isDisabled.set(disabled); }

  onPhoneInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const val = raw.replace(/[^0-9]/g, '');
    (event.target as HTMLInputElement).value = val;
    this.localPhone.set(val);
    this.onChange(val);
    this.onTouched();
  }

  toggleDropdown(): void {
    if (!this.isDisabled()) {
      this.showDropdown.update(v => !v);
      if (!this.showDropdown()) this.searchQuery.set('');
    }
  }

  selectCountry(c: Country): void {
    this.selectedCountry.set(c);
    this.searchQuery.set('');
    this.showDropdown.set(false);
    this.countryCodeChange.emit(c.dialCode);
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  flagUrl(code: string): string {
    return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;
  }

  @HostListener('document:click', ['$event.target'])
  onOutsideClick(target: EventTarget | null): void {
    if (!this.el.nativeElement.contains(target as Node)) {
      this.showDropdown.set(false);
      this.searchQuery.set('');
    }
  }
}
