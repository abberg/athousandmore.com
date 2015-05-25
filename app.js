var express = require('express'),
	fs = require('fs'),
	app = express(),
	port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
	var folderList = fs.readdirSync(__dirname + '/public/sketches').filter(function(folder){ return !/^\./.test(folder); });  
	res.render('index', { sketches: folderList });
});

var server = app.listen(port, function () {
  console.log('Example app running on', port);
});