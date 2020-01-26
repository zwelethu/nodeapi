const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

//@desc  Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  //Fields to be excluded (control fields)
  const removeFields = ['select', 'sort', 'limit', 'page'];

  // remove all the fields from the query
  removeFields.forEach(param => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
  //select fields
  if (req.query.select) query.select(req.query.select.split(',').join(' '));

  //sort
  if (req.query.sort) query.sort(req.query.sort.split(',').join(' '));
  else query.sort('-createdAt');

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query.skip(startIndex).limit(limit);

  //console.log(query);
  const bootcamps = await query;

  //Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
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
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
  // Bootcamp.create(req.body).then(data => {
  //   res.status(201).json({
  //     success: true,
  //     results: data
  //   });
  // });
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
