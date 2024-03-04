const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get('/', reviewController.getAllReview);
router.get('/:id', reviewController.getReview);

router.post(
  '/',
  authController.protect,
  authController.restrictTo('user'),
  reviewController.setTourAndUserId,
  reviewController.createReview
);

router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
