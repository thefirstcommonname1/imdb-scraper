var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

var title, image, rating;
var json = {title: "", image: "", rating: ""};

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', {'json': json});
});

app.post('/', function(req, res) {
  var search = req.body.search;
  url = `http://www.imdb.com/title/${search}/`;

  request(url, function(err, response , html) {
    if (!err) {
      var $ = cheerio.load(html);
    }

    $('.title_wrapper').filter(function(){
      var data = $(this);

      title = data.children().first().text();
      json.title = title;
    });
    $('.imdbRating').filter(function(){
      var data = $(this);
      rating = data.children().first().text();

      json.rating = rating
    });

    image = $('img').filter(function(i, el) {
      return $(this).attr('itemprop') === 'image';
    }).attr('src');
    json.image = image;
    console.log(json);
    res.redirect('/scrape');
  });
});

app.get('/scrape', function(req, res) {
  res.render('scrape', {
    'json': json
  });
})
app.listen(port, function() {
  console.log("Listening on port 3000...");
});
