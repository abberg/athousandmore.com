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

				camera.position.z = 20;
				camera.rotation.y = Math.PI/2;

				new THREE.OBJLoader().load( assetPath + 'skull.obj', populateScene);

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
				
				setTimeout(function(){
					camera.position.z = distanceToFitObjectInFrustum(scene, camera, renderer.domElement);
					camera.lookAt(new THREE.Vector3(0, 4, 0));
					window.addEventListener('resize', function(){
						camera.position.z = distanceToFitObjectInFrustum(scene, camera, renderer.domElement);
					});
				}, 150);
			},

			distanceToFitObjectInFrustum = function(object, camera, canvas){
				
				var cameraDistance,
					bbox = new THREE.Box3().setFromObject(object),
					width  = bbox.size().x,
					height = bbox.size().y,
					aspectRatio = canvas.width / canvas.height,
					fieldOfView = camera.fov,
					closestFace = bbox.max.z;

				if(canvas.width < canvas.height){
					// portrait - size via width
					cameraDistance = ( width / aspectRatio ) / 2 / Math.tan( Math.PI * fieldOfView / 360 );
				}else{
					// landscape - size by height
					cameraDistance = height / 2 / Math.tan( Math.PI * fieldOfView / 360 );
				}
				
				cameraDistance += closestFace;

				return cameraDistance
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