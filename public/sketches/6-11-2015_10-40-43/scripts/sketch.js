(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			skulls = [],
			curve,
			t = 0.002,

			init = function(){
				
				var directionalLight = new THREE.DirectionalLight( 0xfffffff ),
					reflectedLight =  new THREE.DirectionalLight( 0xeeffff, 0.65 );

				scene.add(directionalLight);
				directionalLight.position.set( 0, 1, 0 );

				scene.add(reflectedLight);
				reflectedLight.position.set( 0, -1, 0 );

				renderer.setClearColor( 0xffffff );

				camera.position.z = 15;
				camera.lookAt(new THREE.Vector3(0, 2, 0))

				new THREE.OBJLoader().load('skull.obj', populateScene);

			},

			populateScene = function(skull){
				
				skull.children[0].material = new THREE.MeshLambertMaterial({wrapAround: true});
				skull.children[0].position.y = -2.5;
				skull.children[0].rotation.x = 0.2;
				
				for (var i = 0; i < 40; i++) {
					var currentSkull = skull.clone();
					scene.add(currentSkull);
					var curve = new THREE.CubicBezierCurve3(
						new THREE.Vector3( -15, 0, 0 ),
						new THREE.Vector3( -7 + ( Math.random() * 10 - 5 ), 15 + ( Math.random() * 10 - 5 ), Math.random() * 6 - 3 ),
						new THREE.Vector3( 10, -10, Math.random() * 6 - 3 ),
						new THREE.Vector3( 20, 0, 0 )
					);
					var rot = Math.random() * Math.PI * 2;
					skull.rotation.set(rot, rot, rot);
					skulls.push({container:currentSkull, rotationVelocity: 0.0005 + Math.random()*0.001, time:Math.random(), curve:curve});
				};
				
			},
			
			update = function(timestep){

				var scale;

				skulls.forEach( function( skull ){
					skull.time += t;
					if(skull.time > 1){
						skull.time = 0.01;
					}
					skull.container.position.copy(skull.curve.getPoint(skull.time));

					if(skull.time < 0.5){
						scale = skull.time * 2;
					}else{
						scale = Math.pow( 1 - ( ( skull.time - 0.5 ) * 2 ), 4 );
					}
					skull.container.scale.set(scale, scale, scale)

					skull.container.rotation.x += skull.rotationVelocity * timestep;
					skull.container.rotation.y += skull.rotationVelocity * timestep;
					
				} );
			},
			
			draw = function(interpolation){
				
				renderer.render(scene, camera);
			}

		return{
			init: init,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))