const express=require('express');
const UsersController=require('../controllers/UsersController');
const router=express.Router();

router.get('/users/single',UsersController.GetSingleUser);
router.get('/users/all',UsersController.GetAllUsers);
router.post('/users/register', UsersController.CreateUser);
router.post('/users/login', UsersController.LoginUser);
router.put('/users/update', UsersController.UpdateUser);
router.put('/users/password', UsersController.ChangePassword);


module.exports=router;
