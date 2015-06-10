(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			skulls = [],

			init = function(){
				var directionalLight = new THREE.DirectionalLight( 0xfffffff ),
					reflectedLight =  new THREE.DirectionalLight( 0xeeffff, 0.65 );

				scene.add(directionalLight);
				directionalLight.position.set( 0, 1, 0 );

				scene.add(reflectedLight);
				reflectedLight.position.set( 0, -1, 0 );

				renderer.setClearColor( 0xffffff );

				camera.position.z = 25;

				new THREE.OBJLoader().load('skull.obj', populateScene);

			},

			populateScene = function(skull){
				skull.children[0].material = new THREE.MeshLambertMaterial({wrapAround: true});
				for (var i = 0; i < 40; i++) {
					var currentSkull = skull.clone();
					currentSkull.position.x = Math.random() * 40 - 20;
					currentSkull.position.y = ( Math.random() * 10 - 5 ) * ( 1 - Math.abs( currentSkull.position.x/25 ) );
					currentSkull.position.z = ( Math.random() * 10 - 5 ) * ( 1 - Math.abs( currentSkull.position.x/25 ) );
					currentSkull.scale.multiplyScalar(0.1 + Math.sin( 1 - ( Math.abs( currentSkull.position.x/25 ) ) ) );
					currentSkull.children[0].rotation.set( Math.random() * ( Math.PI * 2 ), Math.random() * ( Math.PI * 2 ), 0)
					scene.add(currentSkull);
					skulls.push({container:currentSkull, rotationVelocity: Math.random() * 0.001});
				};
			},
			
			update = function(timestep){
				skulls.forEach( function( skull ){
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