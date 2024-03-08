const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes//reviewRoutes');
const viewRouter = require('./routes/viewRouter');
const bookingRouter = require('./routes/bookingRoute');

const app = express();

//set view path
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.options('*', cors());

// app.use(fileUpload());

//serving static file
app.use(express.static(path.join(__dirname, 'public')));

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.post('/upload', (req, res) => {
  // Check if files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Access the uploaded file
  const file = req.files.myFile;
  console.log(req.files);
  console.log(file);

  // Move the file to the desired location
  // file.mv('/path/to/destination/filename.ext', err => {
  //   if (err) {
  //     return res.status(500).send(err);
  //   }

  //   res.send('File uploaded successfully');
  // });
});

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
