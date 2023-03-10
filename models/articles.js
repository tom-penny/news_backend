const db = require('../db/connection');

exports.selectAllArticles = (topic, sort_by = "created_at", order = "DESC") =>
{
    const validOrderQueries = ["ASC", "DESC"];
    const validSortQueries = ["article_id", "title", "topic", "author", "body", "created_at", "votes"];

    if (!validSortQueries.includes(sort_by)) return Promise.reject({status:400, message: "Invalid sort query."});
    if (!validOrderQueries.includes(order)) return Promise.reject({status:400, message: "Invalid order query."});

    return (topic)
    ? db.query(`SELECT *,
    (SELECT count(*) FROM comments c WHERE c.article_id = a.article_id)
    AS comment_count FROM articles a WHERE a.topic = $1 ORDER BY ${sort_by} ${order};`, [topic])
    .then(({rows}) =>
    {
        return rows;
    })
    : db.query(`SELECT *,
    (SELECT count(*) FROM comments c WHERE c.article_id = a.article_id)
    AS comment_count FROM articles a ORDER BY ${sort_by} ${order};`)
    .then(({rows}) =>
    {
        return rows;
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
}

exports.selectArticleById = (id) =>
{
    return db.query(`SELECT *,
    (SELECT count(*) FROM comments c WHERE c.article_id = a.article_id)
    AS comment_count FROM articles a WHERE article_id = $1;`, [id])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows[0];
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
};

exports.selectCommentsByArticleId = (id) =>
{
    return db.query(`SELECT * FROM comments WHERE article_id=$1;`, [id])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows;
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
}

exports.insertArticle = (title, topic, author, body) =>
{
    return db.query(`INSERT INTO articles (title, topic, author, body) VALUES ($1, $2, $3, $4)
    RETURNING *;`, [title, topic, author, body])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows[0];
    });
}

exports.incrementArticleVotesById = (id, inc_votes) =>
{
    return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*;`, [id, inc_votes])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows[0];
    })
}

exports.insertCommentByArticleId = (id, author, body) =>
{
    return db.query(`INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *;`, [body, id, author])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows[0];
    });
}