import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { TranslatePipe } from './translate.pipe';
import { STORAGE_DIRECTION, STORAGE_LANGUAGE } from './language';

const LANGUAGES = {
  default: 'en',
  languages: [
    { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl' },
  ]
};

const EN = {
  common: {
    actions: { save: 'Save', only_in_english: 'Only in English' },
    list: { total_one: 'Total: {{count, number}} item', total_other: 'Total: {{count, number}} items' },
    units: { cm: '{{value, number(minimumFractionDigits: 2; maximumFractionDigits: 2)}} cm' }
  }
};

const HE = {
  common: {
    actions: { save: 'שמירה' },
    list: { total_one: 'פריט {{count, number}}', total_two: 'זוג פריטים', total_other: '{{count, number}} פריטים' },
    units: { cm: '{{value, number(minimumFractionDigits: 2; maximumFractionDigits: 2)}} ס״מ' }
  }
};

// an OnPush component like the wing editor: it is only checked again when something marks it
@Component({
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ 'common:actions.save' | t }}</h1><p>{{ 'common:list.total' | t: { count: 2 } }}</p>`
})
class EditedPageComponent {
  editedName = 'a wing I am editing';
}

describe('TranslationService', () => {
  const real_fetch = window.fetch;
  let service: TranslationService;

  function stubServer(languages: unknown = LANGUAGES) {
    window.fetch = (async (url: string) => {
      const path = String(url);
      if (path.endsWith('/i18n/languages')) return new Response(JSON.stringify(languages));
      const lng = path.split('/i18n/bundle/')[1];
      if (lng === 'he') return new Response(JSON.stringify({ resources: { en: EN, he: HE } }));
      if (lng === 'en') return new Response(JSON.stringify({ resources: { en: EN } }));
      return new Response('{}', { status: 404 });
    }) as typeof fetch;
  }

  beforeEach(() => {
    localStorage.removeItem(STORAGE_LANGUAGE);
    service = TestBed.inject(TranslationService);
  });

  afterEach(() => {
    window.fetch = real_fetch;
    localStorage.removeItem(STORAGE_LANGUAGE);
    localStorage.removeItem(STORAGE_DIRECTION);
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  it('uses the saved language, with its direction', async () => {
    stubServer();
    localStorage.setItem(STORAGE_LANGUAGE, 'he');
    await service.init();
    expect(service.language).toBe('he');
    expect(service.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('he');
    expect(document.documentElement.dir).toBe('rtl');
    expect(localStorage.getItem(STORAGE_DIRECTION)).toBe('rtl');
    expect(service.t('common:actions.save')).toBe('שמירה');
  });

  it('falls back to English for a missing translation', async () => {
    stubServer();
    localStorage.setItem(STORAGE_LANGUAGE, 'he');
    await service.init();
    expect(service.tx('common:actions.only_in_english')).toBe('Only in English');
  });

  it('picks the plural form and formats numbers by the language', async () => {
    stubServer();
    await service.init();   // English
    expect(service.t('common:list.total', { count: 1 })).toBe('Total: 1 item');
    expect(service.t('common:list.total', { count: 1234 })).toBe('Total: 1,234 items');
    expect(service.t('common:units.cm', { value: 12.5 })).toBe('12.50 cm');

    localStorage.setItem(STORAGE_LANGUAGE, 'he');
    const hebrew = new TranslationService();
    await hebrew.init();
    expect(hebrew.t('common:list.total', { count: 1 })).toBe('פריט 1');
    expect(hebrew.t('common:list.total', { count: 2 })).toBe('זוג פריטים');
    expect(hebrew.t('common:list.total', { count: 3 })).toBe('3 פריטים');
  });

  it('joins a list the way the language does', async () => {
    window.fetch = (async (url: string) => String(url).endsWith('/i18n/languages')
      ? new Response(JSON.stringify(LANGUAGES))
      : new Response(JSON.stringify({ resources: { en: { common: { missing: 'Missing: {{regions, list}}' } } } }))) as typeof fetch;
    await service.init();
    expect(service.tx('common:missing', { regions: ['L1', 'Top', 'Crown'] })).toBe('Missing: L1, Top, and Crown');
    expect(service.tx('common:missing', { regions: ['L1', 'Top'] })).toBe('Missing: L1 and Top');
  });

  it('shows the key before it is initialized', () => {
    expect(new TranslationService().tx('common:actions.save')).toBe('common:actions.save');
  });

  it('ignores a saved language the server does not have', async () => {
    stubServer();
    localStorage.setItem(STORAGE_LANGUAGE, 'fr');
    await service.init();
    expect(service.language).toBe('en');
  });

  it('shows the keys, in English, when the server cannot be reached', async () => {
    window.fetch = (() => Promise.reject(new Error('offline'))) as typeof fetch;
    await service.init();
    expect(service.language).toBe('en');
    expect(service.languages.length).toBe(1);
    expect(service.tx('common:actions.save')).toBe('actions.save');
  });

  it('switches the language without reloading the page', async () => {
    stubServer();
    await service.init();   // English
    expect(service.t('common:actions.save')).toBe('Save');
    const announced: string[] = [];
    service.changed.subscribe(code => announced.push(code));

    expect(await service.setLanguage('he')).toBeTrue();

    expect(service.language).toBe('he');
    expect(service.dir).toBe('rtl');
    expect(service.version).toBe(1);
    expect(service.t('common:actions.save')).toBe('שמירה');
    expect(service.t('common:list.total', { count: 2 })).toBe('זוג פריטים');
    expect(document.documentElement.lang).toBe('he');
    expect(document.documentElement.dir).toBe('rtl');
    expect(localStorage.getItem(STORAGE_LANGUAGE)).toBe('he');
    expect(localStorage.getItem(STORAGE_DIRECTION)).toBe('rtl');
    expect(announced).toEqual(['he']);

    expect(await service.setLanguage('en')).toBeTrue();   // and back
    expect(service.t('common:actions.save')).toBe('Save');
    expect(service.dir).toBe('ltr');
    expect(announced).toEqual(['he', 'en']);
  });

  it('stays in the language when the new one cannot be loaded or is unknown', async () => {
    stubServer();
    await service.init();
    const announced: string[] = [];
    service.changed.subscribe(code => announced.push(code));
    window.fetch = (() => Promise.reject(new Error('offline'))) as typeof fetch;

    expect(await service.setLanguage('he')).toBeFalse();   // offline
    expect(await service.setLanguage('fr')).toBeFalse();   // not a language of the server
    expect(await service.setLanguage('en')).toBeFalse();   // already in it
    expect(service.language).toBe('en');
    expect(service.t('common:actions.save')).toBe('Save');
    expect(announced).toEqual([]);
  });

  it('shows the new language in a pipe that already exists (nothing is created again)', async () => {
    stubServer();
    await service.init();
    const pipe = new TranslatePipe(service);
    const params = { count: 2 };
    expect(pipe.transform('common:actions.save')).toBe('Save');
    expect(pipe.transform('common:list.total', params)).toBe('Total: 2 items');

    await service.setLanguage('he');

    expect(pipe.transform('common:actions.save')).toBe('שמירה');
    expect(pipe.transform('common:list.total', params)).toBe('זוג פריטים');   // the same arguments, the new language
  });

  it('marks the view of a pipe for checking when the language changes, until the pipe is destroyed', async () => {
    stubServer();
    await service.init();
    let marked = 0;
    const view = { markForCheck: () => marked++ } as unknown as ChangeDetectorRef;
    const pipe = new TranslatePipe(service, view);

    await service.setLanguage('he');
    expect(marked).toBe(1);

    pipe.ngOnDestroy();
    await service.setLanguage('en');
    expect(marked).toBe(1);
  });

  it('follows the language with a default text, but not with a text its owner set', async () => {
    stubServer();
    await service.init();
    const destroyed: Array<() => void> = [];
    const destroyRef = { onDestroy: (callback: () => void) => destroyed.push(callback) } as unknown as DestroyRef;
    const owner = { byDefault: service.t('common:actions.save'), chosen: 'My own text' };
    service.follow(destroyRef, [
      ['common:actions.save', () => owner.byDefault, text => owner.byDefault = text],
      ['common:actions.save', () => owner.chosen, text => owner.chosen = text],
    ]);

    await service.setLanguage('he');
    expect(owner.byDefault).toBe('שמירה');
    expect(owner.chosen).toBe('My own text');

    destroyed.forEach(callback => callback());   // the owner is gone: no more updates
    await service.setLanguage('en');
    expect(owner.byDefault).toBe('שמירה');
  });

  it('switches an OnPush page in place: the text changes, what was edited stays', async () => {
    stubServer();
    await service.init();
    const fixture = TestBed.createComponent(EditedPageComponent);
    const page = fixture.componentInstance;
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toBe('Save');
    page.editedName = 'an edit that was not saved';

    await service.setLanguage('he');
    fixture.detectChanges();

    expect(element.querySelector('h1')?.textContent).toBe('שמירה');
    expect(element.querySelector('p')?.textContent).toBe('זוג פריטים');
    expect(fixture.componentInstance).toBe(page);                      // the same component...
    expect(page.editedName).toBe('an edit that was not saved');         // ...with its edit
  });

  it('translates with the pipe', async () => {
    stubServer();
    await service.init();
    const pipe = new TranslatePipe(service);
    expect(pipe.transform('common:actions.save')).toBe('Save');
    expect(pipe.transform('common:list.total', { count: 2 })).toBe('Total: 2 items');
  });
});
