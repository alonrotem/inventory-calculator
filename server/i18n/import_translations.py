#!/usr/bin/env python3
"""
Puts the translations of an Excel sheet (made by export_translations.py, filled by a translator) into the system:
creates the language folder and files when they do not exist, adds the new texts, overrides the ones that changed.
Empty cells in the translation column are ignored (they never delete an existing text).

    python import_translations.py translations_he.xlsx he
    python import_translations.py french.xlsx fr --name French --native-name Français --dir ltr   # a new language
    python import_translations.py translations_he.xlsx he --dry-run                               # only report

Every row is checked before anything is written:
  * the key must exist in English (a plural form is fine when English has the _other text);
  * the {{placeholders}} of the translation must be the same as the English ones.
A row that fails is reported and skipped (use --force to accept placeholder differences).
Afterwards run `npm run i18n:check` in the server folder.
Needs: pip install openpyxl (see requirements.txt).
"""
import argparse
import sys
from collections import OrderedDict
from pathlib import Path

try:
    from openpyxl import load_workbook
except ImportError:
    sys.exit("openpyxl is missing: pip install -r requirements.txt")

from _i18n_common import (DEFAULT_I18N_DIR, MASTER, PLURAL, namespaces, placeholders,
                          read_json, set_path, write_json)


def english_texts(i18n_dir):
    """'ns:path' -> English text, for every key."""
    return {f"{ns}:{path}": text for ns, items in namespaces(i18n_dir, MASTER).items() for path, text in items}


def source_for(key, english):
    """The English text a key is translated from: its own, or the _other text for a plural form English does not have."""
    if key in english:
        return english[key]
    match = PLURAL.search(key)
    if match:
        return english.get(f"{key[: match.start()]}_other")
    return None


def read_sheet(path):
    sheet = load_workbook(path, read_only=True, data_only=True).worksheets[0]
    rows = sheet.iter_rows(values_only=True)
    header = next(rows, None)
    if not header or str(header[0] or "").strip().lower() != "key":
        sys.exit(f"{path}: the first column must be 'Key' (is this a sheet made by export_translations.py?)")
    for number, row in enumerate(rows, start=2):
        key = str(row[0] or "").strip()
        translation = row[2] if len(row) > 2 else None
        if key:
            yield number, key, ("" if translation is None else str(translation))


def register_language(i18n_dir, lng, args):
    config_path = i18n_dir / "languages.json"
    config = read_json(config_path)
    if lng in config["languages"]:
        return False
    config["languages"][lng] = OrderedDict(name=args.name, nativeName=args.native_name, dir=args.dir)
    write_json(config_path, config)
    return True


def main():
    parser = argparse.ArgumentParser(description="Import a translated Excel sheet into the app's translation files.")
    parser.add_argument("excel", help="the Excel file")
    parser.add_argument("language", help="language code to write, e.g. he, yi, fr")
    parser.add_argument("--i18n-dir", default=str(DEFAULT_I18N_DIR), help="the translations folder (default: the folder of this script)")
    parser.add_argument("--dry-run", action="store_true", help="report what would change, write nothing")
    parser.add_argument("--force", action="store_true", help="accept rows whose {{placeholders}} differ from English")
    parser.add_argument("--name", help="English name of a new language, e.g. French")
    parser.add_argument("--native-name", help="name of a new language in itself, e.g. Français")
    parser.add_argument("--dir", choices=["ltr", "rtl"], help="writing direction of a new language")
    args = parser.parse_args()

    i18n_dir = Path(args.i18n_dir)
    lng = args.language.strip()
    if lng == MASTER:
        sys.exit("English is the master language; it is not imported.")
    excel = Path(args.excel)
    if not excel.exists():
        sys.exit(f"{excel} not found")

    known = lng in read_json(i18n_dir / "languages.json")["languages"]
    if not known and not (args.name and args.native_name and args.dir):
        sys.exit(f"'{lng}' is a new language: add --name, --native-name and --dir (ltr or rtl) so it can be registered in languages.json.")

    english = english_texts(i18n_dir)
    errors, updates = [], OrderedDict()   # updates: namespace -> [(path, text)]
    for number, key, text in read_sheet(excel):
        text = text.strip()
        if not text:
            continue
        if ":" not in key:
            errors.append(f"row {number}: '{key}' is not a key (expected namespace:path)")
            continue
        source = source_for(key, english)
        if source is None:
            errors.append(f"row {number}: '{key}' does not exist in English")
            continue
        if placeholders(text) != placeholders(source) and not args.force:
            errors.append(f"row {number}: '{key}' has the placeholders {{{','.join(placeholders(text))}}}, English has {{{','.join(placeholders(source))}}}")
            continue
        ns, path = key.split(":", 1)
        updates.setdefault(ns, []).append((path, text))

    created = changed = unchanged = 0
    pending = []   # (file, data)
    for ns, items in updates.items():
        file = i18n_dir / lng / f"{ns}.json"
        data = read_json(file) if file.exists() else OrderedDict()
        current = {}
        for path, existing in namespaces(i18n_dir, lng).get(ns, []):
            current[path] = existing
        for path, text in items:
            if path not in current:
                created += 1
            elif current[path] != text:
                changed += 1
            else:
                unchanged += 1
            set_path(data, path, text)
        pending.append((file, data))

    for message in errors:
        print("skipped:", message)
    print(f"{lng}: {created} new, {changed} changed, {unchanged} unchanged, {len(errors)} skipped, {len(pending)} file(s)")
    if args.dry_run:
        print("dry run: nothing written")
        return
    if errors and not (created or changed or unchanged):
        sys.exit("nothing to import")
    for file, data in pending:
        write_json(file, data)
        print("wrote", file.relative_to(i18n_dir.parent) if i18n_dir.parent in file.parents else file)
    if not known and register_language(i18n_dir, lng, args):
        print(f"registered '{lng}' in languages.json")
    print("next: npm run i18n:check (in the server folder)")
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
