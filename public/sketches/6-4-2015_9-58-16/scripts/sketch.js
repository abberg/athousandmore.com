 (function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			//controls = new THREE.OrbitControls( camera ),
			shells = [],

			init = function(){
				var geometry,
					material,
					mesh,
					sphereBSP,
					sphereBSP2,
					boxBSP,
					boxBSP2,
					result,
					directionalLight = new THREE.DirectionalLight( 0x005566 ),
					keyLight = new THREE.SpotLight(0xffffff),
					pointLight = new THREE.PointLight( 0xff0099, 1.0, 3 );
				

				scene.add(keyLight);
				
				keyLight.intensity = 1;
				keyLight.distance = 0;
				keyLight.angle = Math.PI / 3;
				keyLight.exponent = 3;
				keyLight.decay = 2;
				
				keyLight.position.set( 0, 10, 5);
				keyLight.target.position.set(0, 0, -5);
				//var slh = new THREE.SpotLightHelper(keyLight);
				//scene.add(slh);

				scene.add(directionalLight);
				directionalLight.position.set( 0, -1, 0 );

				scene.add( pointLight );

				geometry = new THREE.PlaneBufferGeometry( 30, 10, 1 );
				material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
				mesh = new THREE.Mesh( geometry, material );

				mesh.position.z = -5;
				scene.add( mesh );

				geometry = new THREE.IcosahedronGeometry( 1.5, 2 );
				mesh = new THREE.Mesh( geometry );
				sphereBSP = new ThreeBSP( mesh );

				geometry = new THREE.BoxGeometry( 4, 4, 2);
				mesh = new THREE.Mesh( geometry );
				mesh.position.set(0, 0, -1);
				boxBSP = new ThreeBSP( mesh );

				geometry = new THREE.BoxGeometry( 4, 2, 4);
				mesh = new THREE.Mesh( geometry );
				mesh.position.set(0, -1, 0);
				boxBSP2 = new ThreeBSP( mesh );

				geometry = new THREE.IcosahedronGeometry( 1.4 , 2);
				mesh = new THREE.Mesh( geometry);
				sphereBSP2 = new ThreeBSP( mesh );

				result = sphereBSP
							.subtract( boxBSP )
							.subtract( boxBSP2 )
							.subtract( sphereBSP2 )
							.toMesh( new THREE.MeshPhongMaterial({color: 0x667777, shininess: 40}) );

				for(var i = 2; i < 14; i++){
					var current = result.clone();
					current.scale.multiplyScalar(i/14);
					current.rotation.x =  Math.random() * ( Math.PI * 2 );
					current.rotation.y =  Math.random() * ( Math.PI * 2 );
					current.userData.xVelocity = Math.random() * 0.04 - 0.02;
					current.userData.yVelocity = Math.random() * 0.04 - 0.02;
					scene.add(current);
					shells.push(current);
				}

				camera.position.z = 3;
			},
			
			framestart = function(timestamp){
				
			},

			update = function(timestep){
				//controls.update();
				shells.forEach(function(shell){
					shell.rotation.x += shell.userData.xVelocity;
					shell.rotation.z += shell.userData.yVelocity;
				});
			},
			
			draw = function(interpolation){
				//result.rotation.y += 0.005;
			}

		return{
			init: init,
			framestart: framestart,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))