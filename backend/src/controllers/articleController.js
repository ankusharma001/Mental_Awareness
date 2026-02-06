const Article = require('../models/Article');
const User = require('../models/User');
const badWords = require('../utils/badWords');

function containsProfanity(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return badWords.some(word => lower.includes(word));
}

exports.createArticle = async (req, res) => {
  const { title, content } = req.body;

  if (containsProfanity(title) || containsProfanity(content)) {
    return res.status(400).json({ message: 'Profanity is not allowed.' });
  }

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 120) {
    return res.status(400).json({ message: `Article must be at least 120 words. Current count: ${wordCount}` });
  }

  try {
    const article = await Article.create({
      title, content, author: req.user._id
    });
    await article.populate('author', 'username avatar');
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: 'Failed to post article.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch articles.' });
  }
};

exports.likeToggle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    const userId = req.user._id.toString();
    const i = article.likes.findIndex(u => u.toString() === userId);
    if (i === -1) {
      article.likes.push(userId);
    } else {
      article.likes.splice(i, 1);
    }
    await article.save();
    res.json(article.likes);
  } catch (err) {
    res.status(500).json({ message: 'Like failed.' });
  }
};

exports.edit = async (req, res) => {
  const { title, content } = req.body;
  if (containsProfanity(title) || containsProfanity(content)) {
    return res.status(400).json({ message: 'Profanity is not allowed.' });
  }
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only author can edit.' });
    }
    article.title = title;
    article.content = content;
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Edit failed.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only author can delete.' });
    }
    await article.remove();
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed.' });
  }
};
