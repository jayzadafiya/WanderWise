const factory = require('./handlerFactory');
const Review = require('../model/reviewModel');

exports.setTourAndUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

// exports.createReview = async (req, res) => {
//   try {
//     //allow nested routes
//       if (!req.body.tour) req.body.tour = req.params.tourId;
//       if (!req.body.user) req.body.user = req.user.id;

//     const review = await Review.create(req.body);

//     res.status(201).json({
//       status: 'succuss',
//       data: {
//         review
//       }
//     });
//   } catch (error) {
//     res.status(403).json({
//       error: error.message,
//       status: 'fail'
//     });
//   }
// };
exports.getAllReview = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
