const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentsController');
const token_authentification = require('../auth/token_auth');
const delete_auth = require('../auth/delete_post_comment_auth');

router.post('/comments', token_authentification, CommentController.CreateComment);
router.put('/comments', token_authentification, CommentController.UpdateComment);
router.delete('/comments', token_authentification, delete_auth, CommentController.DeleteComment
)
;


module.exports = router;
