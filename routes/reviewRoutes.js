const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get('/', reviewController.getAllReview);

router.post(
  '/',
  authController.protect,
  authController.restrictTo('user'),
  reviewController.createReview
);

module.exports = router;
