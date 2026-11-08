#!/usr/bin/env node
// Checks the translation files in server/i18n against the English ones (the master), and the keys used in the code.
//
//   npm run i18n:check     report problems; exit code 1 when there are errors
//   npm run i18n:types     also write the typed key list used by the Angular app (web/src/app/i18n/translation-keys.ts)
//
// Errors:   a key missing from a language, different {{placeholders}} than English, a key used in the code that English doesn't have
// Warnings: keys a language has but English doesn't, missing plural forms, empty texts, English keys no code refers to
//           (keys built at runtime can't be seen by the scan: they show as unused)

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const i18n_dir = path.join(root, 'i18n');
const types_file = path.join(root, '..', 'web', 'src', 'app', 'i18n', 'translation-keys.ts');
const code_dirs = [path.join(root, '..', 'web', 'src'), root];
const skipped_dirs = new Set(['node_modules', 'i18n', 'scripts', 'dist', '.angular', 'uploads', 'logs']);

const PLURAL = /_(zero|one|two|few|many|other)$/;
const errors = [];
const warnings = [];

function read_json(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  catch (e) {
    errors.push(`${path.relative(root, file)}: ${e.message}`);
    return {};
  }
}

/** { 'ns:path.to.key': 'text' } for a language folder */
function flatten_language(lng) {
  const out = {};
  const lng_dir = path.join(i18n_dir, lng);
  if (!fs.existsSync(lng_dir)) {
    return out;
  }
  for (const file of fs.readdirSync(lng_dir).filter(f => f.endsWith('.json'))) {
    const ns = path.basename(file, '.json');
    const walk = (node, prefix) => {
      for (const [k, v] of Object.entries(node)) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          walk(v, key);
        }
        else if (typeof v === 'string') {
          out[`${ns}:${key}`] = v;
        }
        else {
          errors.push(`${lng}/${file}: '${key}' must be a string or an object`);
        }
      }
    };
    walk(read_json(path.join(lng_dir, file)), '');
  }
  return out;
}

const base_of = key => key.replace(PLURAL, '');
const placeholders = text => [...new Set([...text.matchAll(/\{\{\s*([^,}\s]+)/g)].map(m => m[1]))].sort().join(',');

function plural_forms(lng) {
  try {
    return new Intl.PluralRules(lng).resolvedOptions().pluralCategories;
  }
  catch {
    return ['one', 'other'];
  }
}

function source_files(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipped_dirs.has(entry.name)) source_files(path.join(dir, entry.name), out);
    }
    else if (/\.(ts|html|js)$/.test(entry.name) && !/\.spec\.ts$/.test(entry.name) && entry.name !== 'translation-keys.ts') {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

/** Key-looking strings ('namespace:some.key') in the code, with their files. */
function used_keys(namespaces) {
  const used = new Map();
  const pattern = new RegExp(`['"\`]((?:${namespaces.join('|')}):[A-Za-z0-9_.]+)['"\`]`, 'g');
  for (const dir of code_dirs) {
    for (const file of source_files(dir)) {
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(pattern)) {
        if (!used.has(m[1])) used.set(m[1], new Set());
        used.get(m[1]).add(path.relative(path.join(root, '..'), file));
      }
    }
  }
  return used;
}

const config = read_json(path.join(i18n_dir, 'languages.json'));
const default_lng = config.default;
const codes = Object.keys(config.languages ?? {});
if (!codes.includes(default_lng)) {
  errors.push(`languages.json: the default language '${default_lng}' is not in the list`);
}

const master = flatten_language(default_lng);
const master_keys = Object.keys(master);
const master_bases = [...new Set(master_keys.map(base_of))].sort();

for (const lng of codes.filter(c => c !== default_lng)) {
  const texts = flatten_language(lng);
  const required = plural_forms(lng);
  for (const key of master_keys) {
    const base = base_of(key);
    const is_plural = PLURAL.test(key);
    if (is_plural) {
      continue;   // plural forms are checked per language below
    }
    if (!(key in texts)) {
      errors.push(`${lng}: missing '${key}'`);
    }
    else {
      if (!texts[key].trim()) warnings.push(`${lng}: '${key}' is empty`);
      if (placeholders(texts[key]) !== placeholders(master[key])) {
        errors.push(`${lng}: '${key}' has the placeholders {${placeholders(texts[key])}}, English has {${placeholders(master[key])}}`);
      }
    }
  }
  // plurals: every base English has in plural form needs this language's own forms
  for (const base of new Set(master_keys.filter(k => PLURAL.test(k)).map(base_of))) {
    const english_text = master[master_keys.find(k => base_of(k) === base && PLURAL.test(k))];
    for (const form of required) {
      const key = `${base}_${form}`;
      if (!(key in texts)) {
        // a missing form is an error: i18next falls back to the *English* text for it, not to this language's _other
        errors.push(`${lng}: missing plural form '${key}'`);
      }
      else if (placeholders(texts[key]) !== placeholders(english_text)) {
        errors.push(`${lng}: '${key}' has the placeholders {${placeholders(texts[key])}}, English has {${placeholders(english_text)}}`);
      }
    }
  }
  for (const key of Object.keys(texts)) {
    const plural_ok = PLURAL.test(key) && required.includes(key.match(PLURAL)[1]) && master_bases.includes(base_of(key));
    if (!(key in master) && !plural_ok) {
      warnings.push(`${lng}: '${key}' is not in ${default_lng}`);
    }
  }
}

// keys used in the code
const namespaces = [...new Set(master_keys.map(k => k.split(':')[0]))];
if (namespaces.length) {
  const used = used_keys(namespaces);
  // a key ending with a dot is the start of a key built at runtime ('knives:region_names.' + key): it uses all the keys under it
  const prefixes = [...used.keys()].filter(k => k.endsWith('.'));
  for (const [key, files] of used) {
    const is_prefix = key.endsWith('.');
    if (is_prefix ? !master_bases.some(b => b.startsWith(key)) : (!master_bases.includes(key) && !(key in master))) {
      errors.push(`'${key}' is used but ${default_lng} doesn't have it (${[...files].join(', ')})`);
    }
  }
  for (const base of master_bases) {
    if (!used.has(base) && !prefixes.some(p => base.startsWith(p))) warnings.push(`'${base}' is not used in the code`);
  }
}

if (process.argv.includes('--types')) {
  const body = master_bases.map(k => `  | '${k}'`).join('\n');
  fs.mkdirSync(path.dirname(types_file), { recursive: true });
  fs.writeFileSync(types_file,
    `// Generated by \`npm run i18n:types\` (in the server folder) from server/i18n/${default_lng}/*.json. Do not edit.\n` +
    `// Plural keys appear once, without their _one / _other suffix.\n` +
    `export type TranslationKey =\n${body || "  never"};\n`);
  console.log(`Wrote ${master_bases.length} keys to ${path.relative(path.join(root, '..'), types_file)}`);
}

warnings.forEach(w => console.log(`warning: ${w}`));
errors.forEach(e => console.log(`ERROR:   ${e}`));
console.log(`${codes.length} languages, ${master_bases.length} keys, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
