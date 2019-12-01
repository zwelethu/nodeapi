const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
//Route files
const bootcamps = require('./routes/bootcamps');

//logger file
//dev logging middleware
//Load config file
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//app.use(logger);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
  res.send('<H1>Hi from express</H1>');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  //close server and exit process
  server.close(() => process.exit(1));
});
