const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: '0gfyFmt1MgvERAallm6iobqR0XGZdMGU',
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
