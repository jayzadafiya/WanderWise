const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tore must have a name'],
      unique: true,
      trim: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size']
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'difficult']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tore must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageCover: {
      type: String,
      required: true
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    //when json and object data fetch add virtual property
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//this virtual propery create when get some data from database
//Donn't use array function because that not refer this keyword
//we can not use this filed in query because it is not part of database
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

//document middleware:run on save() and create() command
//this keyword refer to current doucment
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query take ${Date.now() - this.start} milisecend!`);
  next();
});

//aggrigation middelware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }
  });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
