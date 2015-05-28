(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			cubes = [],
			container,

			init = function(){
				
				var geometry,
					material,
					mesh,
					i,
					numBoxes = 200,
					boxWidth = 0.05,
					boxDepth = 2,
					container,
					model,
					previousModel,
					keyLight = new THREE.DirectionalLight( 0xffffff ),
					bounceLight = new THREE.DirectionalLight( 0xffffff, 0.3 );

				container = new THREE.Object3D();

				for(i = 0; i < numBoxes; i++){

					geometry = new THREE.BoxGeometry( boxWidth, 1, boxDepth ),
					material = new THREE.MeshPhongMaterial( { color: 0xFF3300, shininess: 100 } ),
					mesh = new THREE.Mesh( geometry, material ),
					
					mesh.position.x = -4.5 + ( i * boxWidth );
					mesh.rotation.x = ( i * 0.04 );

					model = new THREE.Object3D();
					previousModel = model.clone();

					cubes.push({container:container, model:model, previousModel:previousModel});
				
					container.add(mesh);

				}
				scene.add( container );

				scene.add(keyLight);
				keyLight.position.set( 1, 1, 0.5 );

				scene.add(bounceLight);
				bounceLight.position.set( 1, -1, 1 );

				renderer.setClearColor(0x2D4445);

				camera.position.z = 3;
			
			},
			
			update = function(timestep){
				var i,
					cl = cubes.length, 
					currentCube;

				for(i = 0; i < cl; i++){

					var currentCube = cubes[i].container;
					currentCube.rotation.x -= 0.00004;

				}

			},
			
			draw = function(interpolation){
				
			}

		return{
			init: init,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))