import { ChangeDetectorRef, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from './translation.service';
import { TranslationKey } from './translation-keys';

/**
 * What the pipes below share. They show the new language as soon as it is switched (the page is not reloaded, so what a
 * user was editing stays), which a pure pipe would not: it is not asked again for the same arguments.
 * So they are impure, but cheap: each remembers its last result and computes again only when an argument or the language changed.
 * Like AsyncPipe, they check their view again when the language changes (so OnPush components are updated too).
 * (Used by composition: a pipe that extends a decorated base class stops being standalone.)
 */
class LanguageMemory {
  private subscription?: Subscription;
  private shownVersion = -1;
  private shownArgs: unknown[] = [];
  private shown = '';

  constructor(private translation: TranslationService, changeDetector?: ChangeDetectorRef) {
    this.subscription = changeDetector ? translation.changed.subscribe(() => changeDetector.markForCheck()) : undefined;
  }

  remember(args: unknown[], compute: () => string): string {
    const same = this.shownVersion === this.translation.version
      && args.length === this.shownArgs.length
      && args.every((arg, i) => arg === this.shownArgs[i]);
    if (!same) {
      this.shownVersion = this.translation.version;
      this.shownArgs = args;
      this.shown = compute();
    }
    return this.shown;
  }

  destroy() {
    this.subscription?.unsubscribe();
  }
}

/**
 * {{ 'common:actions.save' | t }}
 * {{ 'common:list.total' | t: { count: totalRecords } }}    (plural form and number format by the language)
 * The key is checked against the English translations at build time.
 */
@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private memory: LanguageMemory;

  constructor(private translation: TranslationService, @Optional() changeDetector?: ChangeDetectorRef) {
    this.memory = new LanguageMemory(translation, changeDetector);
  }

  transform(key: TranslationKey, params?: Record<string, unknown>): string {
    return this.memory.remember([key, params], () => this.translation.t(key, params));
  }

  ngOnDestroy() {
    this.memory.destroy();
  }
}

/** {{ bank.quantity | tquantity: bank.raw_material_quantity_units }}  ->  "1,250.50 kg" or "300 units", in the language */
@Pipe({ name: 'tquantity', standalone: true, pure: false })
export class TranslateQuantityPipe implements PipeTransform, OnDestroy {
  private memory: LanguageMemory;

  constructor(private translation: TranslationService, @Optional() changeDetector?: ChangeDetectorRef) {
    this.memory = new LanguageMemory(translation, changeDetector);
  }

  transform(value: number | null | undefined, units: string | null | undefined): string {
    return this.memory.remember([value, units], () => this.translation.quantity(value, units));
  }

  ngOnDestroy() {
    this.memory.destroy();
  }
}

/**
 * For a value that comes from the database (an order status, say): {{ order.order_status | tenum: 'customers:order_status.' }}
 * Shows the translation of prefix + value, or the value itself when there is none.
 */
@Pipe({ name: 'tenum', standalone: true, pure: false })
export class TranslateEnumPipe implements PipeTransform, OnDestroy {
  private memory: LanguageMemory;

  constructor(private translation: TranslationService, @Optional() changeDetector?: ChangeDetectorRef) {
    this.memory = new LanguageMemory(translation, changeDetector);
  }

  transform(value: string | null | undefined, prefix: string): string {
    return this.memory.remember([value, prefix], () => this.translation.enumLabel(prefix, value));
  }

  ngOnDestroy() {
    this.memory.destroy();
  }
}
