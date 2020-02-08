const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  addBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');
// Include other resource routers
const courseRouter = require('./courses');
const router = express.Router();

const { protect, authorise } = require('../middleware/auth');

//re-route into other resources
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorise('publisher', 'admin'), addBootcamp);

router
  .route('/:id')
  .put(protect, authorise('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorise('publisher', 'admin'), deleteBootcamp)
  .get(getBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

module.exports = router;
