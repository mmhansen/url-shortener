var validUrl = require('valid-url');

// Url handling function
function urlHandler(db) {
  var urls = db.collection('urls');
  var counters = db.collection('counters');

  function getNextUrl(name, callback){
    var ret = counters.findAndModify(
      { _id: name },
      [],
      { $inc: { seq: 1 } },
      {new: true, upsert: true},
      function(err, result){
        if(err){console.error(err)}
        else {
          callback(result.value.seq)
        }
      }
    )
  }

  this.getUrl = function (req, res) {
    var shortUrl = parseInt(req.params.shortUrl);
    urls.findOne({_id: shortUrl}, function(err, result){
      if (err) {console.error(err)}
      else {
        if (result){
          res.redirect(result.url);
        } else {
          res.json({"error":"Invalid url"})
        }
      }
    })
  }

  this.addUrl = function (req, res) {
    if(!validUrl.isUri(req.params.url)){
      res.json({"error":"Invalid url"})
      return;
    } else {
      getNextUrl('urls', function(seq){
        urls.insert({
          _id: seq,
          url: req.params.url
        }, function (err, result){
          if (err) {console.error(err)}
          else {
            res.json({
              "original_url":req.params.url,
              "short_url":"https://hn-url-shortener.herokuapp.com/"+ result.ops[0]._id
            })
          }
        })
      })
    }
  }
}
// routes
module.exports = function (app, db){
  // create instance of handler object
  var handleUrls = new urlHandler(db)

  app.route('/:shortUrl')
    .get(handleUrls.getUrl);


  app.route('/add/:url(*)')
    .get(handleUrls.addUrl);
}
