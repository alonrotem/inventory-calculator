import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';
import { TranslationKey } from './translation-keys';

/**
 * {{ 'common:actions.save' | t }}
 * {{ 'common:list.total' | t: { count: totalRecords } }}    (plural form and number format by the language)
 * The key is checked against the English translations at build time.
 */
@Pipe({ name: 't', standalone: true })
export class TranslatePipe implements PipeTransform {
  constructor(private translation: TranslationService) {}

  // pure: the language only changes with a reload
  transform(key: TranslationKey, params?: Record<string, unknown>): string {
    return this.translation.t(key, params);
  }
}

/** {{ bank.quantity | tquantity: bank.raw_material_quantity_units }}  ->  "1,250.50 kg" or "300 units", in the language */
@Pipe({ name: 'tquantity', standalone: true })
export class TranslateQuantityPipe implements PipeTransform {
  constructor(private translation: TranslationService) {}

  transform(value: number | null | undefined, units: string | null | undefined): string {
    return this.translation.quantity(value, units);
  }
}

/**
 * For a value that comes from the database (an order status, say): {{ order.order_status | tenum: 'customers:order_status.' }}
 * Shows the translation of prefix + value, or the value itself when there is none.
 */
@Pipe({ name: 'tenum', standalone: true })
export class TranslateEnumPipe implements PipeTransform {
  constructor(private translation: TranslationService) {}

  transform(value: string | null | undefined, prefix: string): string {
    return this.translation.enumLabel(prefix, value);
  }
}
