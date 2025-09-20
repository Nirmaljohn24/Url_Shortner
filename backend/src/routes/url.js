const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.post('/create', urlController.createShortUrl);
router.get('/:code/stats', urlController.getStats);
router.get('/', urlController.listUrls);

module.exports = router;
