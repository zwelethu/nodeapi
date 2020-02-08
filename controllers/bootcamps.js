const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');

//@desc  Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc  Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

//@desc  Create a bootcamp
//@route POST /api/v1/bootcamps/
//@access Private

exports.addBootcamp = asyncHandler(async (req, res, next) => {
  //add user to req,body
  req.body.user = req.user.id;
  //check for published bootcamp
  publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  //if the user is not an admin, they can only add 1 bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

//@desc  Update a single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

//@desc  Delete a single bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

//@desc  GET bootcamps within radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  //cal radius using radians
  //divide dist by radius of Earth
  //Ear radius is 3963 miles/6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
  });

  if (!bootcamps) {
    return next(
      new ErrorResponse(
        `No Bootcamps found within radius ${req.params.radius}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
