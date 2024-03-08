const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../model/tourModel');
const Booking = require('../model/bookingModel');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/?tour=${
        req.params.tourId
      }&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
            },
            unit_amount: tour.price * 100
          },
          quantity: 1
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      session
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.createBookingCheckout = async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  try {
    const { tour, user, price } = req.query;
    console.log(tour, user, price);
    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });

    res.redirect('/my-tours');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
