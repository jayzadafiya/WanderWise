const User = require('../model/userModel');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.updateMe = async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      message:
        'This route is not for password updates. please use /update-my-password'
    });
  }

  const filterBody = filterObj(req.body, 'name', 'email');

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
