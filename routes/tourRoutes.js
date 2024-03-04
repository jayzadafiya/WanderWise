const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

router.get(
  '/top-5-cheap',
  tourController.aliasToTours,
  tourController.getAllTours
);

router.get('/tour-stats', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router.post(
//   '/:tourId/reviews',
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview
// );
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
