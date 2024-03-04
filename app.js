const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reivewRouter = require('./routes//reviewRoutes');

const app = express();
//set security HTTP headers
app.use(helmet());

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//set rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many reuest for this Ip, please try again in a hour'
});
//limiter affect only all /api routee
app.use('/api', limiter);

//Body parser, reading data from body int req.body
app.use(express.json({ limit: '10kb' }));

//data sanitization aginest NoSQL query injection
app.use(mongoSanitize());

//data sanitization aginest xss=html code with js convert to entity
app.use(xss());

//prevetn parameter polutions
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'price'
    ]
  })
);

//serving static file
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reivewRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`Cant't find ${req.originalUrl} on this server!`);
  err.status = 'Fail';
  err.statusCode = 400;

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
module.exports = app;
