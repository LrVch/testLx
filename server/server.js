var API_URL = 'http://localhost:3000';
var distFolder = 'dist';
var defaultPort = 4040;
var express = require('express');
var cors = require('cors');
var app = express();
var path = require('path');
app.use(cors({origin: API_URL}));
app.use(express.static(distFolder));


app.listen(defaultPort, function () {
  console.log('app listening on port ' + defaultPort + '!');
});

app.get('/', function(req, res) {
  res.sendfile(path.join(__dirname, '/' + distFolder + '/index.html'));
});


app.get('/news', function(req, res) {
    setTimeout(function() {
      res.json({ a: 1 });
    }, 2000);
  // return makeError(res, 404, 'not found');
});

function makeError(res, status, error) {
  return res.status(status)
    .json({
      status: status,
      error: error
    });
}