const {incrementCommentVotesById, deleteCommentsById} = require('../models/comments');

exports.patchCommentVotesById = (req, res, next) =>
{
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    incrementCommentVotesById(comment_id, inc_votes)
    .then((comment) =>
    {
        res.status(200).send({comment});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.deleteCommentsById = (req, res, next) =>
{
    const {comment_id} = req.params;
    deleteCommentsById(comment_id)
    .then(() =>
    {
        res.sendStatus(204);
    })
    .catch((err) =>
    {
        next(err);
    });
}