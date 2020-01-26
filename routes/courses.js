const express = require('express');
const {
  getCourses
  //,
  //   getBootcamps,
  //   updateBootcamp,
  //   deleteBootcamp,
  //   addBootcamp,
  //   getBootcampsInRadius
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses);

// router
//   .route('/:id')
//   .put(updateBootcamp)
//   .delete(deleteBootcamp)
//   .get(getBootcamp);

module.exports = router;
