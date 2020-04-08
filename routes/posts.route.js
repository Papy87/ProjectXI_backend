const express=require('express');
const PostCorntrollers=require('../controllers/PostsController');
const router=express.Router();

router.get('/posts', PostCorntrollers.GetAllPosts);
router.get('/posts/:id', PostCorntrollers.GetSinglePostByID);
router.get('/posts/:id/comments', PostCorntrollers.GetAllPostComments);
router.put('/posts/:id', PostCorntrollers.UpdatePostByID);
router.delete('/posts/:id', PostCorntrollers.DeletePostByID);
router.post('/posts', PostCorntrollers.CreatePost);




module.exports=router;
