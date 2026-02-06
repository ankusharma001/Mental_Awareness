const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middleware/auth');

// @route   GET api/articles
// @desc    Get all articles
// @access  Public
router.get('/', articleController.getAllArticles);

// @route   GET api/articles/:id
// @desc    Get article by ID
// @access  Public
router.get('/:id', articleController.getArticleById);

// @route   POST api/articles
// @desc    Create an article
// @access  Private
router.post('/', auth, articleController.createArticle);

// @route   POST api/articles/:id/like
// @desc    Like an article
// @access  Private
router.post('/:id/like', auth, articleController.likeArticle);

module.exports = router;
