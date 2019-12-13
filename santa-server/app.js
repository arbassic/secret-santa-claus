require('rootpath')();
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Setup mongo
const cors = require('cors');
const jwt = require('middlewares/jwt');
const errorHandler = require('middlewares/error-handler');
const mongoose = require('mongoose');

// Fix 'deprecation' warnings 
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('debug', true);

const mongoPromise =
  mongoose.connect(process.env.DB_AUTH_URL);

mongoPromise.then(() => {
  
  console.log('[app.js] db connected');

}).catch((err) => {
  
  console.error('[app.js] db: Something went wrong', err);

});


mongoose.Promise = global.Promise;


const app = express();

const port = process.env.PORT;

app.set('port', process.env.PORT);

console.log(`Listening at port ${port}`);
try {

  app.listen(port);

} catch (exception) { 
  
  console.log(exception);

}

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

// Use JWT auth to secure the api
app.use(jwt());

app.use(express.static(path.join(__dirname, 'public')));

// Add middleware: provide db
app.use((req, res, next) => {
  
  req.db = mongoose;
  next();
  
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/users', require('./users/users.controller'));
app.use('/events', require('./events/events.controller'));

// Todo: app.use('/favicon.ico', usersRouter);

app.use(errorHandler);


module.exports = app;
