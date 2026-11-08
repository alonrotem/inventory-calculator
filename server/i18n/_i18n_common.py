"""Shared helpers for export_translations.py and import_translations.py."""
import json
import re
import subprocess
from collections import OrderedDict
from pathlib import Path

DEFAULT_I18N_DIR = Path(__file__).resolve().parent
MASTER = "en"
PLURAL = re.compile(r"_(zero|one|two|few|many|other)$")
PLACEHOLDER = re.compile(r"\{\{\s*([^,}\s]+)")


def read_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f, object_pairs_hook=OrderedDict)


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def flatten(node, prefix=""):
    """{'a': {'b': 'x'}} -> [('a.b', 'x')], in file order."""
    items = []
    for key, value in node.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            items.extend(flatten(value, path))
        else:
            items.append((path, value))
    return items


def set_path(node, path, value):
    parts = path.split(".")
    for part in parts[:-1]:
        child = node.get(part)
        if not isinstance(child, dict):
            child = node[part] = OrderedDict()
        node = child
    node[parts[-1]] = value


def namespaces(i18n_dir, lng):
    """namespace -> flattened [(path, text)] for a language folder (empty when the language does not exist yet)."""
    folder = Path(i18n_dir) / lng
    result = OrderedDict()
    if folder.is_dir():
        for file in sorted(folder.glob("*.json")):
            result[file.stem] = flatten(read_json(file))
    return result


def placeholders(text):
    return sorted(set(PLACEHOLDER.findall(text or "")))


def plural_categories(lng):
    """The plural forms a language needs (CLDR), asked from Node's Intl. Falls back to one/other."""
    try:
        out = subprocess.run(
            ["node", "-e", f"console.log(JSON.stringify(new Intl.PluralRules({json.dumps(lng)}).resolvedOptions().pluralCategories))"],
            capture_output=True, text=True, timeout=20, check=True,
        ).stdout
        return json.loads(out)
    except Exception:
        print(f"warning: could not ask Node for the plural forms of '{lng}', assuming one/other")
        return ["one", "other"]


def rows_for_language(i18n_dir, lng):
    """
    The rows of the sheet: (key, english, translation, file), in the order of the English files.
    Plural keys get one row for each form the target language needs (Hebrew: one, two, other; Arabic: six...),
    with the English text of that form, or of _other when English has no such form.
    """
    english = namespaces(i18n_dir, MASTER)
    target = {ns: dict(items) for ns, items in namespaces(i18n_dir, lng).items()}
    needed = plural_categories(lng)
    rows = []
    for ns, items in english.items():
        en = dict(items)
        done = set()
        for path, text in items:
            match = PLURAL.search(path)
            if match:
                base = path[: match.start()]
                if base in done:
                    continue
                done.add(base)
                for form in needed:
                    p = f"{base}_{form}"
                    source = en.get(p) if p in en else en.get(f"{base}_other", text)
                    rows.append((f"{ns}:{p}", source, target.get(ns, {}).get(p, ""), f"{ns}.json"))
            else:
                rows.append((f"{ns}:{path}", text, target.get(ns, {}).get(path, ""), f"{ns}.json"))
    return rows
