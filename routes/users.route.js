const express = require('express');
const UsersController = require('../controllers/UsersController');
const upload = require('../middleware/profile_images_upload_middleware');
const token_authentification=require('../auth/token_auth');
const router = express.Router();



router.get('/users', token_authentification,UsersController.GetAllUsers);
router.get('/users/:id', token_authentification,UsersController.GetUserById)
router.get('/users/profil',token_authentification, UsersController.GetUserProfile);
router.post('/users/register', UsersController.CreateUser);
router.post('/users/login', UsersController.LoginUser);
router.put('/users/update',token_authentification,upload.fields([{name:'avatar_url', maxCount:1}, {name: 'cover_url',maxCount: 1}]), UsersController.UpdateUser);
router.post('/users/forgot', UsersController.ForgotPassword);
router.put('/users/reset/:id', UsersController.ResetPassword);
router.get('/users/confirmation/:token', UsersController.EmailConfirmation)


module.exports = router;
