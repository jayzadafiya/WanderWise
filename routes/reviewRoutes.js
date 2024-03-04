const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', reviewController.getAllReview);

router.post(
  '/create-review',
  authController.protect,
  authController.restrictTo('user'),
  reviewController.createReview
);

module.exports = router;
