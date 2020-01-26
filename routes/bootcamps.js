const express = require('express');
const {
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  addBootcamp,
  getBootcampsInRadius
} = require('../controllers/bootcamps');

//include other resource routers
const courseRouter = require('./courses');
const router = express.Router();

//re-route into other resources
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(getBootcamps)
  .post(addBootcamp);

router
  .route('/:id')
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

module.exports = router;
