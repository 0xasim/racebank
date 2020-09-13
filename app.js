require('dotenv').config({path: __dirname + '/.env'})

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
var session = require('express-session');

var indexRouter = require('./routes/index');
var raceRouter = require('./routes/race');
var transRouter = require('./routes/trans');  // transaction router
var newAccRouter = require('./routes/new');
var {isSession} = require('./routes/is');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: process.env['session_secret']
}));
app.use(isSession)

const db_username = encodeURIComponent(process.env['db_username'])
const db_password = encodeURIComponent(process.env['db_password'])
const db_clusterUrl = process.env['db_clusterUrl']
const db_authMechanism = process.env['db_authMechanism']
const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_clusterUrl}/?authMechanism=${db_authMechanism}`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    await client.db("racingbank").command({ ping: 1 });
    console.log("Connected successfully to server");
    db = client.db("racingbank")
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.use('/', indexRouter);
app.use('/transaction', transRouter);
app.use('/race', raceRouter);
app.use('/new', newAccRouter);

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
