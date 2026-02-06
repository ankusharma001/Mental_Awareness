const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const a = require('../controllers/articleController');

// Get all articles
router.get('/', a.getAll);
// Create article
router.post('/', auth, a.createArticle);
// Like/unlike
router.post('/:id/like', auth, a.likeToggle);
// Edit
router.put('/:id', auth, a.edit);
// Delete
router.delete('/:id', auth, a.remove);

module.exports = router;
