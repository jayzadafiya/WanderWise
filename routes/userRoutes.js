const express = require('express');
const userController = require('./../controllers/userController');
const authControler = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authControler.signup);
router.post('/login', authControler.login);

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
