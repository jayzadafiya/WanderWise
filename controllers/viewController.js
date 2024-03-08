const Tour = require('../model/tourModel');
const User = require('../model/userModel');
const Bookings = require('../model/bookingModel');

exports.getOverview = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).render('overview', {
      title: 'All tours',
      tours
    });
  } catch (error) {
    res.status(400).render('error', {
      title: 'Something went wrong!',
      message: error.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user'
    });

    if (!tour) {
      return res.status(404).render('error', {
        title: 'Something went wrong!',
        message: 'Tour not find with this name'
      });
    }
    res.status(200).render('tour', {
      title: tour.name,
      tour
    });
  } catch (error) {
    console.log(error);
    res.status(400).render('overview', {
      message: error.message
    });
  }
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login');
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup');
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserdata = async (req, res, next) => {
  console.log(req.body);
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updateUser
  });
};

exports.getMyTours = async (req, res) => {
  try {
    //find all booking
    const bookings = await Bookings.find({ user: req.user.id });

    // find tours with the return referance Id
    const tourId = bookings.map(el => el.tour);

    const tours = await Tour.find({ _id: { $in: tourId } }); //findById

    res.status(200).render('overview', {
      title: 'My tours',
      tours
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
