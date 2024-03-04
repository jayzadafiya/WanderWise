const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => {
  return async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        res.status(404).json({
          status: 'fail',
          message: 'No document fond with this id '
        });
      }

      res.status(204).json({
        status: 'success'
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
  };
};

exports.updateOne = Model => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.createOne = Model => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: doc
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getOne = (Model, popOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No document fond with this id '
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getAll = Model => async (req, res) => {
  try {
    //allow for nested GET reviews on tour
    let filter = {};

    if (req.params.tourId) {
      filter = {
        tour: req.params.tourId
      };
    }
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFiels()
      .pagination();

    const doc = await features.query;
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No document fond '
      });
    }

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: doc.length,
      data: {
        doc
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
