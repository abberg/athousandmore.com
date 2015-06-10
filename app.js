var express = require('express'),
	fs = require('fs'),
	app = express(),
	port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {

	var folderList = fs.readdirSync(__dirname + '/public/sketches').filter(function(folder){ return !/^\./.test(folder); });
	
	folderList.sort(function(a,b){
	
		var aArr = a.split('_'),
			bArr = b.split('_'),
			c,
			d;
		
		aArr[0] = aArr[0].split('-');
		aArr[1] = aArr[1].split('-');
		bArr[0] = bArr[0].split('-');
		bArr[1] = bArr[1].split('-');

		c = new Date(aArr[0][2], aArr[0][0] - 1, aArr[0][1], aArr[1][0], aArr[1][1], aArr[1][2]);
		d = new Date(bArr[0][2], bArr[0][0] - 1, bArr[0][1], bArr[1][0], bArr[1][1], bArr[1][2]);

		if (c > d) return -1;
  		if (c < d) return 1;
  		return 0;
	
	});  
	
	res.render('index', { sketches: folderList });

});

var server = app.listen(port, function () {
  console.log('Example app running on', port);
});