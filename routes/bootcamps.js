const express = require('express');
const {
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  addBootcamp
} = require('../controllers/bootcamps');

const router = express.Router();

router
  .route('/')
  .get(getBootcamps)
  .post(addBootcamp);

router
  .route('/:id')
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getBootcamp);

module.exports = router;
