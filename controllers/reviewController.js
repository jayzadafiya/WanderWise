const Review = require('../model/reviewModel');

exports.getAllReview = async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'succuss',
    results: reviews.length,
    data: {
      reviews
    }
  });
};

exports.createReview = async (req, res) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'succuss',
    data: {
      review
    }
  });
};
