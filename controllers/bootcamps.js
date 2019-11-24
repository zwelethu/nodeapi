//@desc  Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

//@desc  Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { id: req.params.id },
    msg: 'get a single bootcamp'
  });
};

//@desc  Create a bootcamp
//@route POST /api/v1/bootcamps/
//@access Private

exports.addBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, data: { id: 1 }, msg: 'create a single bootcamp' });
};

//@desc  Update a single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { id: req.params.id },
    msg: `update a single bootcamp with id ${req.params.id}`
  });
};

//@desc  Delete a single bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { id: req.params.id },
    msg: `delete a single bootcamp with id ${req.params.id}`
  });
};
