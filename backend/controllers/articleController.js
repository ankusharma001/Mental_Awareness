const Article = require('../models/Article');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username avatar');
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(500).send('Server Error');
    }
};

exports.createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newArticle = new Article({
            title,
            content,
            author: req.user.id
        });

        const article = await newArticle.save();
        await article.populate('author', 'username avatar');

        res.json(article);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.likeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const index = article.likes.indexOf(req.user.id);
        if (index === -1) {
            // Like
            article.likes.unshift(req.user.id);
        } else {
            // Unlike
            article.likes.splice(index, 1);
        }

        await article.save();
        res.json(article.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
