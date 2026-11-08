const express = require('express');
const router = express.Router();
const i18n = require('../services/i18n');

// Public (needed before signing in): the translations are shared with the client, see services/i18n.js.
// no-cache: the browser asks every time, and gets a 304 (ETag) unless a translation changed.

/* GET the supported languages */
/* curl -i http://localhost:3000/i18n/languages */
router.get('/languages', function(req, res) {
  res.set('Cache-Control', 'no-cache');
  res.json({ default: i18n.default_language(), languages: i18n.languages() });
});

/* GET the translations of a language (and of the default language, as fallback) */
/* curl -i http://localhost:3000/i18n/bundle/he */
router.get('/bundle/:lng', function(req, res) {
  if (!i18n.is_supported(req.params.lng)) {
    return res.status(404).json({ message: `Language '${req.params.lng}' is not supported` });
  }
  res.set('Cache-Control', 'no-cache');
  res.json(i18n.bundle(req.params.lng));
});

module.exports = router;
