(function(){

	"use strict";
	
	var loop = ab.gameLoop(),
		three = ab.threeBase(),
		sketch = ab.sketch(three);

	loop.addEventListener('framestart', function(event){

		var timestamp = event.detail.timestamp;
		sketch.framestart(timestamp);
	
	})

	loop.addEventListener('frameupdate', function(event){

		var timestep = event.detail.timestep;
		sketch.update(timestep);
	
	})

	loop.addEventListener('framedraw', function(event){

		var interpolation = event.detail.interpolation;
		sketch.draw(interpolation);
		three.renderer().render(three.scene(), three.camera());

	});

	sketch.init();
	loop.start();

	if(ab.controlBar){
		ab.controlBar(loop, three);
	}

}())