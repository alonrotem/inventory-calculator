# Translations

One set of files for the whole app: the server reads them from disk, and the Angular client downloads them from `GET /i18n/bundle/<lng>`.

```
languages.json            the languages (code, name, native name, direction) and the default one
<lng>/<namespace>.json    the texts; English (en) is the master
```

## Keys

`<namespace>:<path.to.key>`, e.g. `common:actions.save` is `actions.save` in `en/common.json`.
Keep one namespace per area of the app (`common`, `knives`, `wings`...).

```html
{{ 'common:actions.save' | t }}
{{ 'common:list.total' | t: { count: totalRecords } }}
```
```ts
this.translation.t('common:status.saved');          // checked against the English keys at build time
this.translation.tx('status:' + name);              // a key built at runtime: not checked
```

On the server: `req.t('common:errors.not_found')` (language of the request), or
`throw translatable_error(404, 'common:errors.not_found', { name })` from `services/i18n.js`: the error handler answers `{ message, code, params }` in the language of the request.

## Texts

* Values: `"Hello {{name}}"`.
* Numbers and dates use the browser's / Node's `Intl`: `{{value, number}}`, `{{value, number(minimumFractionDigits: 2; maximumFractionDigits: 2)}}`, `{{when, datetime(dateStyle: medium)}}`.
* Plurals: write one key per form, picked by `count`: `total_one`, `total_other`. Hebrew also has `total_two`.
  The forms a language needs are those of its CLDR plural rules (`new Intl.PluralRules('he').resolvedOptions().pluralCategories`).
* A text never goes into `[innerHTML]` (values are not escaped by i18next).

## Workflow

In the `server` folder:

```
npm run i18n:check    # a key missing from a language, different {{placeholders}}, keys used in the code that English doesn't have
npm run i18n:types    # the same, and rewrites web/src/app/i18n/translation-keys.ts (commit it)
```

Run `i18n:types` after adding or renaming an English key, or a typo in a key won't be caught by the Angular build.
A missing translation shows the English text.

## Adding a language

1. `languages.json`: add it with its `dir` (`ltr` / `rtl`).
2. Add `<lng>/<namespace>.json` for each namespace (start from a copy of the English ones).
3. For Angular's own date / number pipes: add the language to `ANGULAR_LOCALES` in `web/src/app/i18n/language.ts`
   (without it, those pipes use the English formats).

## Working with a translator (Excel)

Two Python scripts in this folder (`pip install -r requirements.txt`; Node.js must be on the path, it tells the scripts which plural forms a language has):

```
python export_translations.py he                 # -> translations_he.xlsx
python export_translations.py fr -o french.xlsx  # a language the system does not have yet
python export_translations.py he --missing       # only the rows without a translation

python import_translations.py translations_he.xlsx he
python import_translations.py french.xlsx fr --name French --native-name Français --dir ltr   # registers the new language
python import_translations.py translations_he.xlsx he --dry-run                               # only report
```

The sheet has four columns: **Key**, **English**, the language, and **File** (the JSON file the text lives in).
Plural keys have a row for each form the language needs; the English column shows the matching English text (or the `_other` one).
The translator fills the third column and keeps the `{{placeholders}}` as they are (`{{count, number}}` stays as it is, only the words around it change).

The import creates or overrides the texts it is given; empty cells are ignored (they never delete anything), and a row with an unknown key or different
`{{placeholders}}` is reported and skipped (`--force` accepts placeholder differences). Then run `npm run i18n:check`.
For a new language also see "Adding a language" (step 3).

## Right-to-left

* The direction comes from `languages.json`. The app sets `<html dir>` and loads Bootstrap's RTL stylesheet.
* In styles use logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`) and Bootstrap's `ms-` / `me-` / `ps-` / `pe-` classes, not `left` / `right`.
* Things that are physical stay left-to-right: the knife editor and the wing diagram (L1 / lefts / rights describe the real knife), a toggle switch.
* Mirror directional icons (back arrows) with `[dir=rtl] ... { transform: scaleX(-1) }`.
