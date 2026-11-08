const fs = require('fs');
const path = require('path');
const i18next = require('i18next');
const { AsyncLocalStorage } = require('async_hooks');

// The translations live in server/i18n, one folder per language and one JSON file per namespace:
//   server/i18n/languages.json        the supported languages (and the default one)
//   server/i18n/<lng>/<namespace>.json
// The server uses them directly, and the client downloads them from /i18n/bundle/<lng> (routes/i18n.js).
// A key is written as '<namespace>:<path.to.key>', e.g. 'common:actions.save'.

const i18n_dir = path.join(__dirname, '..', 'i18n');
const FRESHNESS_CHECK_MS = 1000;

let languages_config = null;
let resources = {};
let instance = null;
let signature = '';
let last_check = 0;

function read_json(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function translation_files() {
  const files = [];
  for (const lng of Object.keys(read_json(path.join(i18n_dir, 'languages.json')).languages)) {
    const lng_dir = path.join(i18n_dir, lng);
    if (!fs.existsSync(lng_dir)) {
      continue;
    }
    for (const file of fs.readdirSync(lng_dir).filter(f => f.endsWith('.json'))) {
      files.push({ lng, ns: path.basename(file, '.json'), file: path.join(lng_dir, file) });
    }
  }
  return files;
}

// translations edited on the server show up without a restart
function files_signature(files) {
  return [path.join(i18n_dir, 'languages.json'), ...files.map(f => f.file)]
    .map(file => `${file}:${fs.statSync(file).mtimeMs}`)
    .join('|');
}

function load() {
  const files = translation_files();
  languages_config = read_json(path.join(i18n_dir, 'languages.json'));
  resources = {};
  for (const { lng, ns, file } of files) {
    (resources[lng] ??= {})[ns] = read_json(file);
  }
  const codes = Object.keys(languages_config.languages);
  const namespaces = [...new Set(files.map(f => f.ns))];

  instance = i18next.createInstance();
  instance.init({
    resources,
    lng: languages_config.default,
    fallbackLng: languages_config.default,
    supportedLngs: codes,
    ns: namespaces,
    defaultNS: 'common',
    initAsync: false,
    interpolation: { escapeValue: false },   // plain text (the client escapes what it renders)
    returnNull: false
  });
  signature = files_signature(files);
  last_check = Date.now();
}

function ensure_fresh() {
  if (instance && Date.now() - last_check < FRESHNESS_CHECK_MS) {
    return;
  }
  last_check = Date.now();
  if (!instance || files_signature(translation_files()) !== signature) {
    load();
  }
}

function default_language() {
  ensure_fresh();
  return languages_config.default;
}

/** [{ code, name, nativeName, dir }] */
function languages() {
  ensure_fresh();
  return Object.entries(languages_config.languages).map(([code, info]) => ({ code, ...info }));
}

function is_supported(code) {
  ensure_fresh();
  return Object.prototype.hasOwnProperty.call(languages_config.languages, code);
}

function direction(code) {
  ensure_fresh();
  return languages_config.languages[code]?.dir ?? 'ltr';
}

/** The best supported language for an Accept-Language header ('he-IL,he;q=0.9,en;q=0.8'), or the default. */
function resolve_language(accept_language) {
  ensure_fresh();
  const requested = String(accept_language ?? '')
    .split(',')
    .map(part => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map(p => p.trim()).find(p => p.startsWith('q='));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    .filter(r => r.tag && r.tag !== '*' && r.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of requested) {
    const base = tag.split('-')[0];
    if (is_supported(tag)) return tag;
    if (is_supported(base)) return base;
  }
  return languages_config.default;
}

/** Translates a key into a language (the default language when it is not supported). */
function t(lng, key, params) {
  ensure_fresh();
  return instance.getFixedT(is_supported(lng) ? lng : languages_config.default)(key, params);
}

/** Everything the client needs for a language: its translations and the default language's, as fallback. */
function bundle(lng) {
  ensure_fresh();
  const fallback = languages_config.default;
  return {
    lng,
    dir: direction(lng),
    fallback,
    resources: { [fallback]: resources[fallback] ?? {}, [lng]: resources[lng] ?? {} }
  };
}

// The language of the request being handled (set by middleware/language.js), so services can translate without being handed `t`.
const request_language = new AsyncLocalStorage();

/** Runs fn (and everything it awaits) in the language of a request. */
function run_in_language(lng, fn) {
  return request_language.run(lng, fn);
}

function current_language() {
  return request_language.getStore() ?? default_language();
}

/** Translates a key into the language of the current request (the default language outside of a request). */
function tr(key, params) {
  return t(current_language(), key, params);
}

/**
 * An error for the client to show in its own language: the error handler (index.js) answers
 * { message: <translated>, code: key, params }. `message` stays a readable sentence, so existing clients keep working.
 */
function translatable_error(statusCode, key, params) {
  const error = new Error(t(default_language(), key, params));
  error.statusCode = statusCode;
  error.status = statusCode;   // the routes that answer errors themselves look at `status`
  error.i18n = { key, params };
  return error;
}

/**
 * A translatable error without a status of its own, for the places that used to `throw new Error(text)`:
 * whoever catches it decides the status, as before (500 when it reaches the error handler).
 */
function fail(key, params) {
  const error = new Error(t(default_language(), key, params));
  error.i18n = { key, params };
  return error;
}

/** The JSON body for an error: translated into the language of the request when the error is translatable. */
function error_body(req, err) {
  if (err && err.i18n) {
    return { message: req.t(err.i18n.key, err.i18n.params), code: err.i18n.key, params: err.i18n.params };
  }
  return { message: err && err.message };
}

module.exports = {
  default_language,
  languages,
  is_supported,
  direction,
  resolve_language,
  t,
  bundle,
  run_in_language,
  current_language,
  tr,
  translatable_error,
  fail,
  error_body
};
