var express = require('express'),
	fs = require('fs'),
	htmlparser = require("htmlparser2"),
	app = express(),
	port = process.env.PORT || 3000,
	folderList = fs.readdirSync(__dirname + '/public/sketches').filter(function(folder){ return !/^\./.test(folder); });
	
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

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {  
	
	res.render('index', { sketches: folderList });

});

app.get('/*', function (req, res) {

	var sources = [],
		parser,
		i,
		fl,
		isTitle = false,
		title = '',
		currentFolder,
		assetPath,
		nextFolder,
		previousFolder,
		githubUrl;
	assetPath = '/sketches' + req.originalUrl + '/'
	fs.readFile(__dirname + '/public' + assetPath + 'index.html', {encoding: 'utf-8'}, function(err,data){
	    
	    if (!err){
	    	
	    	parser = new htmlparser.Parser({
				onopentag: function(name, attribs){
					
					if(name === "title"){
						isTitle = true;
					}

					if(name === "meta" && attribs['data-github']){
						githubUrl = attribs['data-github'];
					}
					
					if(name === "script" && attribs.src){
						if(attribs.src.indexOf('//') !== -1){
							sources.push( attribs.src );
						}else{
							sources.push( 'sketches' + req.originalUrl + '/' + attribs.src );
						}
					}
						
				},
				ontext: function(text){
        			if(isTitle){
        				title = text;
        			}
    			},
    			onclosetag: function(name){
        			if(name === "title"){
            			isTitle = false;
        			}
    			}
			}, {decodeEntities: true});
			parser.write(data);
			parser.end();

			for(i = 0, fl = folderList.length; i < fl; i++){
				currentFolder = folderList[i];
				if(currentFolder === req.originalUrl.substring(1)){
					
					if(folderList[i-1]){
						previousFolder = folderList[i-1];
					}

					if(folderList[i+1]){
						nextFolder = folderList[i+1];
					}

					break;
				}
			}

			res.render('page', { 
				title: title,
				sources: sources, 
				assetPath: assetPath, 
				previousFolder: previousFolder, 
				nextFolder: nextFolder,
				githubUrl: githubUrl 
			});

	    }else{
	        console.log(err);
	    }

	});
});

var server = app.listen(port, function () {
  console.log('Example app running on', port);
});