(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			container,
			model,
			previousModel,

			init = function(){
				var geometry = new THREE.BoxGeometry( 1, 1, 1 ),
					material = new THREE.MeshLambertMaterial( { color: 0xffffff } ),
					mesh = new THREE.Mesh( geometry, material ),
					directionalLight = new THREE.DirectionalLight( 0xffffff );

				container = new THREE.Object3D();
				model = new THREE.Object3D();
				previousModel = model.clone();
				
				container.add(mesh);
				scene.add( container );

				scene.add(directionalLight);
				directionalLight.position.set( 1, 1, 1 );

				renderer.setClearColor( 0x333333 );

				camera.position.z = 3;
			},
			
			update = function(timestep){
				var rotationVelocity = 0.001;
				
				model.clone(previousModel);
				model.rotation.x += rotationVelocity * timestep;
				model.rotation.y += rotationVelocity * timestep;
				
			},
			
			draw = function(interpolation){
				THREE.Quaternion.slerp ( previousModel.quaternion, model.quaternion, container.quaternion, interpolation );
			}

		return{
			init: init,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))