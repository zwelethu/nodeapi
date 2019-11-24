const express = require('express');
const dotenv = require('dotenv');

//Route files
const bootcamps = require('./routes/bootcamps');

//Load config file
dotenv.config({ path: './config/config.env' });

const app = express();

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
  res.send('<H1>Hi from express</H1>');
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
