var express = require('express');
var mongo = require('mongodb').MongoClient;
var routes = require('./app/index.js');

var app = express();

// connect to db
var url = 'mongodb://admin:123@ds021326.mlab.com:21326/project';
// process.env.MONGOLAB_URI
mongo.connect(url, function(err, db){
  if (err) {
    console.error(err)
  } else {
    console.log('Successfully connected to MongoDB on port 27017.');
  }
  // serve home page
  app.use(express.static('./public'));
  // load route function
  routes(app, db);
})
// listen on port 3000
var server = app.listen(process.env.PORT || 3000, function(){
  console.log('App listening on port 3000')
});
