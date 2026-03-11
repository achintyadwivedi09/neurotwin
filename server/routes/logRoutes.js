const express = require('express');
const router = express.Router();
const { createLog, getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createLog);
router.get('/:userId', protect, getLogs);

module.exports = router;
