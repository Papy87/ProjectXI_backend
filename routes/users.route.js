const express = require('express');
const UsersController = require('../controllers/UsersController');
const upload = require('../middleware/image_upload');
const router = express.Router();


router.get('/users/single', UsersController.GetSingleUser);
router.get('/users/all', UsersController.GetAllUsers);
router.post('/users/register', UsersController.CreateUser);
router.post('/users/login', UsersController.LoginUser);
router.put('/users/update',upload.fields([{name:'avatar_url', maxCount:1}, {name: 'cover_url',maxCount: 1}]), UsersController.UpdateUser);
router.put('/users/password', UsersController.ChangePassword);
router.post('/users/forgot', UsersController.ForgotPassword);
router.put('/users/reset/:id', UsersController.ResetPassword);
router.get('/users/confirmation/:token', UsersController.EmailConfirmation)


module.exports = router;
