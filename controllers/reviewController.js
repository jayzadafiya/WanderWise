const Review = require('../model/reviewModel');

exports.getAllReview = async (req, res) => {
  let filter = {};

  if (req.params.tourId) {
    filter = {
      tour: req.params.tourId
    };
  }
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'succuss',
    results: reviews.length,
    data: {
      reviews
    }
  });
};

exports.createReview = async (req, res) => {
  try {
    //allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const review = await Review.create(req.body);

    res.status(201).json({
      status: 'succuss',
      data: {
        review
      }
    });
  } catch (error) {
    res.status(403).json({
      error: error.message,
      status: 'fail'
    });
  }
};
