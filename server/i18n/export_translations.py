#!/usr/bin/env python3
"""
Exports the texts of the app for a translator: an Excel sheet with four columns
    Key | English | <Language> | File
The language does not have to exist in the system yet: its column is then empty.
A language that already exists comes with its current translations, so the translator can review and fix them.

    python export_translations.py he                 # -> translations_he.xlsx
    python export_translations.py fr -o french.xlsx  # a new language
    python export_translations.py he --missing       # only the rows that have no translation yet

Plural keys have one row per form the language needs (Hebrew: _one, _two, _other); where English has no such form
the English column shows the _other text. Back in the system: import_translations.py.
Needs: pip install openpyxl (see requirements.txt), and Node.js (to ask which plural forms a language has).
"""
import argparse
import sys
from pathlib import Path

try:
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter
except ImportError:
    sys.exit("openpyxl is missing: pip install -r requirements.txt")

from _i18n_common import DEFAULT_I18N_DIR, MASTER, read_json, rows_for_language

HEADER_FILL = PatternFill("solid", fgColor="1F4E78")
EMPTY_FILL = PatternFill("solid", fgColor="FFF2CC")   # yellow: waiting for a translation


def language_info(i18n_dir, lng):
    config = i18n_dir / "languages.json"
    if config.exists():
        return read_json(config).get("languages", {}).get(lng)
    return None


def main():
    parser = argparse.ArgumentParser(description="Export the app's texts to an Excel sheet for a translator.")
    parser.add_argument("language", help="language code, e.g. he, yi, fr (it may be a language the system does not have yet)")
    parser.add_argument("-o", "--output", help="the Excel file to write (default: translations_<language>.xlsx)")
    parser.add_argument("--i18n-dir", default=str(DEFAULT_I18N_DIR), help="the translations folder (default: the folder of this script)")
    parser.add_argument("--missing", action="store_true", help="only the rows without a translation")
    parser.add_argument("--rtl", action="store_true", help="the language is written right to left (known languages are read from languages.json)")
    args = parser.parse_args()

    i18n_dir = Path(args.i18n_dir)
    lng = args.language.strip()
    if lng == MASTER:
        sys.exit("English is the master language: there is nothing to translate into it.")
    if not (i18n_dir / MASTER).is_dir():
        sys.exit(f"No English texts found in {i18n_dir / MASTER}")

    info = language_info(i18n_dir, lng)
    rtl = args.rtl or (info or {}).get("dir") == "rtl"
    label = (info or {}).get("name") or lng
    rows = rows_for_language(i18n_dir, lng)
    if args.missing:
        rows = [r for r in rows if not r[2].strip()]

    wb = Workbook()
    ws = wb.active
    ws.title = lng[:31]
    ws.append(["Key", "English", label, "File"])
    for key, english, translation, file in rows:
        ws.append([key, english, translation, file])

    for cell in ws[1]:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(vertical="center")
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.data_type = "s"   # texts that start with "=" or "+" must stay texts
            cell.alignment = Alignment(wrap_text=True, vertical="top")
        if rtl:
            row[2].alignment = Alignment(wrap_text=True, vertical="top", horizontal="right", readingOrder=2)
        if not str(row[2].value or "").strip():
            row[2].fill = EMPTY_FILL
    for index, width in enumerate([42, 60, 60, 20], start=1):
        ws.column_dimensions[get_column_letter(index)].width = width
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = ws.dimensions

    output = Path(args.output or f"translations_{lng}.xlsx")
    wb.save(output)
    empty = sum(1 for r in rows if not r[2].strip())
    print(f"{output}: {len(rows)} rows for '{lng}' ({empty} waiting for a translation, {len(rows) - empty} translated)")
    if info is None:
        print(f"'{lng}' is not in languages.json yet; import_translations.py will ask for its name and direction when you import.")


if __name__ == "__main__":
    main()
