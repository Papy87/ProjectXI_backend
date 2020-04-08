const express=require('express');
const router=express.Router();
const CommentController=require('../controllers/CommentsController');

router.post('/comments', CommentController.CreateComment);
router.put('/comments/:id', CommentController.UpdateComment);
router.delete('/comments/:id', CommentController.DeleteComment);



module.exports=router;
