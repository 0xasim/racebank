var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('mongodb')

var indexRouter = require('./routes/index');
var transRouter = require('./routes/trans');  // transaction router

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const uri = `mongodb+srv://${process.env['db_username']}:${process.env['db_password']}@cluster0.gbqtc.mongodb.net/${process.env['db_name']}?retryWrites=true&w=majority`

app.use('/', indexRouter);
app.use('/transaction', transRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
