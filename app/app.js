const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const webpackMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");

const index = require('./routes/index');
const todo = require('./routes/todo');

const Factory = require('./services/factory');

const app = express();

Factory.getModelService().init().catch(ex => {
  console.error(ex);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(webpackMiddleware(webpack({
  // webpack options
  // webpackMiddleware takes a Compiler object as first parameter
  // which is returned by webpack(...) without callback.
  entry: path.join(__dirname, 'public', 'javascripts', 'react', 'main.jsx'),
  output: {
    path: '/react-build/'
    // no real path is required, just pass "/"
    // but it will work with other paths too.
  },
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'public', 'javascripts', 'react'),
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }]
  }
}), {
  // public path to bind the middleware to
  // use the same as in webpack
  publicPath: '/react-build/',

  // The index path for web server, defaults to "index.html".
  // If falsy (but not undefined), the server will not respond to requests to the root URL.
  index: ''
}));

app.use('/', index);
app.use('/api/todo', todo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
