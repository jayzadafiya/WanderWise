const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../model/tourModel');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerStorageImages = multer.memoryStorage();
const multerStorageImageCover = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const errorRespone = {
      message: 'Not an image! please upload only image'
    };
    cb(errorRespone, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadImages = multer({
  storage: multerStorageImages,
  fileFilter: multerFilter
});
const uploadImageCover = multer({
  storage: multerStorageImageCover,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.uploadTourImages = uploadImages.array('images', 3);
exports.uploadTourImageCover = uploadImageCover.single('imageCover');

exports.resizeTourImages = async (req, res, next) => {
  try {
    console.log(req.files);
    // console.log(req.file);
  } catch (error) {
    console.log(error);
  }

  if (req.file) {
    //coverImage
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    console.log(req.body.imageCover);

    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  } else {
    //other Image
    req.body.images = [];

    //here asyncAwit is not wrok and its run code in ragular way
    // so we have to use map method and store all promise in array
    await Promise.all(
      req.files.map(async (image, index) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${index +
          1}.jpeg`;

        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
        console.log(req.body);
      })
    );
  }

  console.log(req.body);
  next();
};

exports.aliasToTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fileds = 'name,ratingsAverage,price,summary,difficulty';
  next();
};

exports.getTour = factory.getOne(Tour, {
  path: 'reviews'
});
//Do not change passwor dwith this controller
exports.updateTour = factory.updateOne(Tour);
exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req, res) => {
  try {
    //aggregate method return aggregate object
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          // _id: null,
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' }
      //   }
      // }
    ]);

    res.status(202).json({
      data: stats
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year || 1;
    const plan = await Tour.aggregate([
      {
        // destructor array field from input document and return document for each array of document
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 6
      }
    ]);

    res.status(202).json({
      data: plan
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};
exports.getToursWithin = async (req, res) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide latitutr and longitude in the format lat,lng.'
    });
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
};

exports.getDistances = async (req, res) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide latitutr and longitude in the format lat,lng.'
    });
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
};
