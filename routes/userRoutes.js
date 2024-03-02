const express = require('express');
const userController = require('./../controllers/userController');
const authControler = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authControler.signup);
router.post('/login', authControler.login);
router.post('/forgot-password', authControler.forgotPassword);
router.patch('/reset-password/:token', authControler.restPassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
