/*-----------------------------------
Use this directive to apply auto-numeric formatting to textboxes (delimiters, decimals, currency etc).
Usage:
Input required validation bahavior:
  Include in the options { ... emptyInputBehavior: 'null' }
  This makes sure that if the control is empty, and set as required, it will be marked as invalid in the form
Add to the component's imports: [..., NumericInputDirective, ...]
Add to the component's html:
    - input should be text, not number, so it can contain symbols
    - inputmode, to make sure the input method is numpad on mobile
    - include the appNumericInput directive


    Option 1, with defaults options:
    <input 
        type="text" 
        appNumericInput
        inputmode="decimal" ...>

    Option 2, with custom options:
    <input 
        type="text" 
        [appNumericInput]="{ decimalPlaces: 2, currencySymbol: '€', currencySymbolPlacement: 'p' }"
        inputmode="decimal" ...>
-----------------------------------*/
import { Directive, ElementRef, Input, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import AutoNumeric, { Options } from 'autonumeric';

@Directive({
  selector: '[appNumericInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericInputDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumericInputDirective),
      multi: true,
    },
  ],
})
export class NumericInputDirective
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  private autoNumericInstance!: AutoNumeric;
  private options!: Options;
  private isUserInput = false;

  private minValue: number | null = null;
  private maxValue: number | null = null;

  @Input('appNumericInput') set config(options: Options | '') {
    const defaultOptions: Options = {
      digitGroupSeparator: ',',
      decimalCharacter: '.',
      decimalPlaces: 0,
      maximumValue: '999999999999999',
      minimumValue: '0',
      emptyInputBehavior: 'null',
      overrideMinMaxLimits: 'invalid',
    };

    const newOptions =
      options && typeof options === 'object'
        ? { ...defaultOptions, ...options }
        : defaultOptions;

    this.minValue = newOptions.minimumValue ? Number(newOptions.minimumValue) : null;
    this.maxValue = newOptions.maximumValue ? Number(newOptions.maximumValue) : null;

    if (this.autoNumericInstance) {
      this.autoNumericInstance.update(newOptions);
    }

    this.options = newOptions;
  }

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnInit(): void {
    this.autoNumericInstance = new AutoNumeric(this.el.nativeElement, this.options);

    this.el.nativeElement.addEventListener('autoNumeric:rawValueModified', (event: any) => {
      if (this.isUserInput) {
        // Get the formatted value that AutoNumeric actually displays
        const formattedValue = this.autoNumericInstance.getNumericString();
        const rawValue = this.autoNumericInstance.getNumber();
        
        // Ensure the value is within bounds before propagating
        const validatedValue = this.validateAndConstrainValue(rawValue);
        
        // If AutoNumeric's raw value differs from our validated value, update it
        if (validatedValue !== rawValue) {
          const prevFlag = this.isUserInput;
          this.isUserInput = false;
          this.autoNumericInstance.set(validatedValue);
          this.isUserInput = prevFlag;
        }
        
        this.onChange(validatedValue);
      }
    });

    // Add input event listener to catch any value changes
    this.el.nativeElement.addEventListener('input', (event: Event) => {
      this.synchronizeValue();
    });

    this.el.nativeElement.addEventListener('focus', () => {
      this.isUserInput = true;
    });

    this.el.nativeElement.addEventListener('blur', () => {
      this.isUserInput = false;
      this.synchronizeValue();
      this.onTouched();
    });
  }

  private synchronizeValue(): void {
    if (!this.autoNumericInstance || !this.isUserInput) return;

    const rawValue = this.autoNumericInstance.getNumber();
    const validatedValue = this.validateAndConstrainValue(rawValue);
    
    // If the raw value exceeds limits, correct both the display and the model
    if (validatedValue !== rawValue) {
      const prevFlag = this.isUserInput;
      this.isUserInput = false;
      this.autoNumericInstance.set(validatedValue);
      this.isUserInput = prevFlag;
      this.onChange(validatedValue);
    }
  }

  private validateAndConstrainValue(value: number | null): number | null {
    if (value === null || isNaN(value)) {
      return null;
    }

    let constrainedValue = value;

    if (this.minValue !== null && value < this.minValue) {
      constrainedValue = this.minValue;
    }

    if (this.maxValue !== null && value > this.maxValue) {
      constrainedValue = this.maxValue;
    }

    return constrainedValue;
  }

  private toNumber(raw: any): number | null {
    if (raw === '' || raw == null) {
      return null;
    }
    
    const num = Number(raw);
    return isNaN(num) ? null : num;
  }

  writeValue(value: any): void {
    if (this.autoNumericInstance) {
      const numericValue =
        typeof value === 'number'
          ? value
          : value != null
          ? Number(value)
          : null;

      // Always constrain the value before setting it
      const constrainedValue = this.validateAndConstrainValue(numericValue);

      const prevFlag = this.isUserInput;
      this.isUserInput = false;
      this.autoNumericInstance.set(constrainedValue ?? null);
      this.isUserInput = prevFlag;
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (value === null || value === undefined) {
      return null;
    }

    const errors: ValidationErrors = {};

    if (this.minValue !== null && value < this.minValue) {
      errors['min'] = { min: this.minValue, actual: value };
    }

    if (this.maxValue !== null && value > this.maxValue) {
      errors['max'] = { max: this.maxValue, actual: value };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  ngOnDestroy(): void {
    if (this.autoNumericInstance) {
      this.autoNumericInstance.remove();
    }
  }
}