const { selectAllArticles,
        selectArticleById,
        selectCommentsByArticleId,
        insertArticle,
        incrementArticleVotesById,
        insertCommentByArticleId } 
        = require('../models/articles');

exports.getAllArticles = (req, res, next) =>
{
    const { topic, sort_by, order } = req.query;
    selectAllArticles(topic, sort_by, order)
    .then((articles) =>
    {
        res.status(200).send({articles});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.getArticleById = (req, res, next) =>
{
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article) =>
    {
        res.status(200).send({article});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.getCommentsByArticleID = (req, res, next) =>
{
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
    .then((comments) =>
    {
        res.status(200).send({comments});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.postArticle = (req, res, next) =>
{
    const {title, topic, author, body} = req.body;
    insertArticle(title, topic, author, body)
    .then((article) =>
    {
        res.status(201).send({article});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.patchArticleVotesById = (req, res, next) =>
{
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    incrementArticleVotesById(article_id, inc_votes)
    .then((article) =>
    {
        res.status(200).send({article});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.postCommentByArticleId = (req, res, next) =>
{
    const { article_id } = req.params;
    const { body, author } = req.body;
    insertCommentByArticleId(article_id, author, body)
    .then((comment) =>
    {
        res.status(201).send({comment});
    })
    .catch((err) =>
    {
        next(err);
    });
}