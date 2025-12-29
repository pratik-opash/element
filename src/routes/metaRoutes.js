const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController');

router.post('/check-meta', metaController.checkMeta);

module.exports = router;
