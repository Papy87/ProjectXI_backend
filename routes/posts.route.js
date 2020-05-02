const express = require('express');
const PostCorntrollers = require('../controllers/PostsController');
const router = express.Router();
const upload = require('../middleware/post_file_middleware');
const token_authentification = require('../auth/token_auth');
const delete_auth = require('../auth/delete_post_comment_auth');
//
router.get('/posts', token_authentification, PostCorntrollers.GetAllPosts);
router.get('/posts/:id', token_authentification, PostCorntrollers.GetSinglePostByID);
router.put('/posts/:id/like', token_authentification, PostCorntrollers.LikeAndDislike);
router.put('/posts/:id', token_authentification, PostCorntrollers.UpdatePostByID);
router.delete('/posts', token_authentification, delete_auth, PostCorntrollers.DeletePostByID);
router.post('/posts', token_authentification, upload.fields([{name: 'image_url', maxCount: 5}, {
    name: 'video_url',
    maxCount: 1
}]), PostCorntrollers.CreatePost);

// router.get('/posts/:id/comments', PostCorntrollers.GetAllPostComments);

module.exports = router;
