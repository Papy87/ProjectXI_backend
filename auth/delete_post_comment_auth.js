const token_decode = require('jwt-decode');

const deleteAuth = (req, res, next) => {
    const token = token_decode(req.headers.authorization.slice(7));
    const id = token.id;
    const {post_id, user_id, comment_id} = req.body;
    if (post_id) {
        if (user_id !== id) {
            return res.status(401).json({message: 'Unauthorized.'})
        }
        next()
    }

    if (comment_id) {
        if (user_id !== id) {
            return res.status(401).json({message: 'Unauthorized.'})
        }
        next()
    }
};


module.exports = deleteAuth;
