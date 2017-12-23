
['BASE_URL', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'].forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing Env: ${key}`);
  }
});

var express = require('express');
var path = require('path');
var fs = require('fs');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var AWS = require('aws-sdk');
var mime = require('mime');
var url = require('url');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var users = fs.existsSync('./users.json') ? require('./users.json') : [];
passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
  },
  function (accessToken, refreshToken, profile, cb) {
    let user = users.find(user => user.googleId === profile.id);
    if (!user) {
      user = { googleId: profile.id, accessToken, refreshToken, profile };
      users.push(user);
      fs.writeFileSync('./users.json', JSON.stringify(users));
    }
    cb(null, user);
  })
);

passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (obj, done) { done(null, obj); });

// Set your region for future requests.
AWS.config.region = process.env.AWS_REGION;
var s3bucket = new AWS.S3({params: {Bucket: process.env.AWS_S3_BUCKET}});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  secret: 'cookie_secret',
  name: 'kaas',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'], hd: process.env.GOOGLE_HOSTED_DOMAIN }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
  var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
  delete req.session.redirectTo;
  // is authenticated ?
  res.redirect(redirectTo);
});

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.redirectTo = req.originalUrl;
    res.redirect('/auth/google');
  };
}

app.get('*', authenticationMiddleware(), function (req, res, next) {
  var prefix = url.parse(req.originalUrl).pathname.split('/').slice(1).join('/');
  if (!prefix || prefix.endsWith('/')) {
    s3bucket.listObjects({ Delimiter: `/${prefix}`, Prefix: prefix }, function (err, data) {
      if (err) { return next(err); }
      const hasIndex = !!data.Contents.find(c => c.Key === `${prefix}index.html`);
      if (hasIndex) {
        res.redirect('index.html');
        return;
      }
      res.render('index', { title: 'Files', data: data });
    });
  } else {
    var params = { Key: prefix, Bucket: process.env.AWS_S3_BUCKET };
    s3bucket.headObject(params, function (err, data) {
      if (err) { return next(err); }
      var stream = s3bucket.getObject(params).createReadStream();
      // forward errors
      stream.on('error', function error (err) {
        // continue to the next middlewares
        return next(err);
      });

      // Add the content type to the response (it's not propagated from the S3 SDK)
      res.set('Content-Type', mime.getType(params.Key));
      res.set('Content-Length', data.ContentLength);
      res.set('Last-Modified', data.LastModified);
      res.set('ETag', data.ETag);

      stream.on('end', function end () {
        console.log('Served by Amazon S3: ', params.Key);
      });
      // Pipe the s3 object to the response
      stream.pipe(res);
    });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
