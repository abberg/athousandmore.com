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
					keyLight = new THREE.SpotLight(0xffffff);
				

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

				geometry = new THREE.IcosahedronGeometry( 1.4 , 2);
				mesh = new THREE.Mesh( geometry);
				sphereBSP2 = new ThreeBSP( mesh );

				result = sphereBSP
							.subtract( boxBSP )
							.subtract( sphereBSP2 )
							.toMesh( new THREE.MeshPhongMaterial({color: 0x667777, shininess: 40}) );

				for(var i = 2; i < 12; i++){
					var current = result.clone();
					current.scale.multiplyScalar(i/12);
					current.rotation.z = ( Math.PI * 2 ) * ( i / 10 );
					scene.add(current);
					shells.push(current);
				}

				camera.position.z = 3;
			},
			
			framestart = function(timestamp){
				for(var i = 0; i < 10; i++){
					var current = shells[i];
					current.rotation.x = ( 5 * ( Math.sin( timestamp  * 0.001 ) ) * (10-i)/10) ;
					current.rotation.y = Math.PI + ( 5 * ( Math.sin( timestamp * 0.001 ) * (10-i)/10) );
					//current.rotation.z += 0.01;
				}
			},

			update = function(timestep){
				//controls.update();
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