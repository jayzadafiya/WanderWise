const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/', reviewController.getAllReview);
router.post(
  '/',
  authController.restrictTo('user'),
  reviewController.setTourAndUserId,
  reviewController.createReview
);

router.get('/:id', reviewController.getReview);
router.patch(
  '/:id',
  authController.restrictTo('user', 'admin'),
  reviewController.updateReview
);
router.delete(
  '/:id',
  authController.restrictTo('user', 'admin'),
  reviewController.deleteReview
);

module.exports = router;
