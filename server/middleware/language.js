const i18n = require('../services/i18n');

/**
 * Sets the language of the request from its Accept-Language header (the client sends the language chosen in the app):
 *   req.language   the language code
 *   req.t(key, params)   translates a key into it
 * and the rest of the request (routes, services) runs in that language: services translate with i18n.tr(key, params).
 */
module.exports = function language(req, res, next) {
  req.language = i18n.resolve_language(req.headers['accept-language']);
  req.t = (key, params) => i18n.t(req.language, key, params);
  i18n.run_in_language(req.language, next);
};
