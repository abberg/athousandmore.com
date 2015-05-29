(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			simplex = new SimplexNoise(),
			noiseY = 0,
			cubes = [],
			container,
			debugContext,

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
					bounceLight = new THREE.DirectionalLight( 0xffffff, 0.3 ),
					debugCanvas;

				container = new THREE.Object3D();

				for(i = 0; i < numBoxes; i++){

					geometry = new THREE.BoxGeometry( boxWidth, 1, boxDepth ),
					material = new THREE.MeshPhongMaterial( { color: 0xFF3300, shininess: 100 } ),
					mesh = new THREE.Mesh( geometry, material ),
					container.add(mesh);

					model = new THREE.Object3D();
					model.position.x = ( i * boxWidth ) - 5;
					model.rotation.x = i * 0.04 ;
					previousModel = model.clone();

					cubes.push({mesh:mesh, model:model, previousModel:previousModel});

				}
				scene.add( container );

				scene.add(keyLight);
				keyLight.position.set( 1, 1, 0.5 );

				scene.add(bounceLight);
				bounceLight.position.set( 1, -1, 1 );

				renderer.setClearColor(0x2D4445);

				camera.position.z = 3;


				debugCanvas = document.createElement('canvas');
				debugCanvas.style.position = 'absolute';
				debugCanvas.style.top = '0';
				debugCanvas.style.left = '0';
				debugCanvas.style.zIndex = '1';
				document.body.appendChild(debugCanvas);
				debugContext = debugCanvas.getContext('2d');

				debugCanvas.style.display = 'none';
			
			},
			
			update = function(timestep){
				
				var noiseSpeed = 0.02,
					noiseScale = 0.2,
					rotationVelocity = 0.01,
					noise,
					index = 0;

				cubes.forEach(function(cube){

					noise = simplex.noise2D(cube.model.position.x * noiseScale, noiseY * noiseScale);
					noise = ((noise + 1) * 0.5);

					cube.model.clone(cube.previousModel);
					cube.model.rotation.x -= rotationVelocity * noise;
					cube.model.scale.y = noise;
					cube.model.scale.z = 1-noise;

					var gray = parseInt(noise * 255);
                   	debugContext.fillStyle = 'rgb('+gray+', '+gray+', '+gray+')';
					debugContext.fillRect( index, 0, 1, 25 );

					index++;
				});

				noiseY += noiseSpeed;
			},
			
			draw = function(interpolation){
				
				cubes.forEach(function(cube){

					//slat.view.position.copy(slat.model.position);
					cube.mesh.position.lerpVectors(cube.previousModel.position, cube.model.position, interpolation);
					THREE.Quaternion.slerp(cube.previousModel.quaternion, cube.model.quaternion, cube.mesh.quaternion, interpolation);
					cube.mesh.scale.lerpVectors(cube.previousModel.scale, cube.model.scale, interpolation);

				});

			}

		return{
			init: init,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))