require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
const errorHandler = require('./handlers/error')
// const authCheckMiddleware = require('./middleware/auth_check');
const { loginRequired } = require("./middleware/auth_check");

var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/build/'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build/')));

// TODO: remove this when deployment
app.use(cors());

app.use('/', indexRouter);
app.use('/news', loginRequired, newsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

module.exports = app;
