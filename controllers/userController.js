const multer = require('multer');
const sharp = require('sharp');
const User = require('../model/userModel');
const factory = require('./handlerFactory');

//it is best practice to store file before resize to memory
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     //error,actual destination
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const fileName = `user-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   }
// });

//this way image is store as buffer
const multerStorage = multer.memoryStorage();

//this middlware not allow to upload file thaat is not image
const multerFilter = (req, file, cb) => {
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

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! please use sign up'
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      message:
        'This route is not for password updates. please use /update-my-password'
    });
  }
  const filterBody = filterObj(req.body, 'name', 'email');

  if (req.file) {
    filterBody.photo = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ status: 'success', updatedUser });
};

exports.deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success'
  });
};
