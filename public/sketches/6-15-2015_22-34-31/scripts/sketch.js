(function(ab){
	"use strict";
	ab.sketch  = function(three){

		var scene = three.scene(),
			camera = three.camera(),
			renderer = three.renderer(),
			frustum = new THREE.Frustum(),
			tempMatrix = new THREE.Matrix4(),
			nudge = new THREE.Vector3(0, 0.01, 0),
			composer,
			spheres = [],

			init = function(){
				
				camera.position.z = 10;
				camera.updateMatrix(); 
				camera.updateMatrixWorld(true);
				camera.matrixWorldInverse.getInverse( camera.matrixWorld );
				
				frustum.setFromMatrix( tempMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );

				setupLighting();
				populateScene();
				setupPostprocessing();
			
			},

			setupLighting = function(){
				var keyLight = new THREE.PointLight( 0xFFFAE8, 1, 25 ),
					bounceLight = new THREE.DirectionalLight( 0xFFFAE8, 0.25);

				keyLight.position.set(0, 5.5, 0);
				scene.add(keyLight);
				bounceLight.position.set(0, -1, 0);
				scene.add(bounceLight);
			},
			
			populateScene = function(){
				var geometry = new THREE.SphereGeometry( 1, 32, 32 ),
					material = new THREE.MeshLambertMaterial( { color: 0xffffff, wrapAround: true } ),
					mesh,
					model,
					previousModel,
					velocity,
					containingSphere,
					numSpheres = 400,
					i;

				for(i = 0; i < numSpheres; i++){
					
					mesh = new THREE.Mesh( geometry, material );
					mesh.position.set(Math.random() * 16 - 8, Math.random() * 8 - 4, Math.random() * 10 - 5 );
					mesh.scale.multiplyScalar(Math.random());
					mesh.updateMatrix();
					mesh.updateMatrixWorld(true);

					model = new THREE.Object3D();
					model.position.copy(mesh.position);
					previousModel = model.clone();

					velocity = new THREE.Vector3();
					velocity.y = 0.003 + ( 0.007 - 0.007 * mesh.scale.x );
					
					if( frustum.intersectsObject( mesh ) ){
						spheres.push({mesh: mesh, model: model, previousModel: previousModel, velocity: velocity});
						scene.add(mesh);
					}
				
				}
				
			},

			setupPostprocessing = function(){
				var depthShader = THREE.ShaderLib[ "depthRGBA" ],
					depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms ),
					fxaa;

				composer = new THREE.EffectComposer( renderer );
				composer.addPass( new THREE.RenderPass( scene, camera ) );

				fxaa = new THREE.ShaderPass( THREE.FXAAShader );
				fxaa.uniforms.resolution.value.set( 1 / renderer.domElement.width, 1 / renderer.domElement.height );
				fxaa.renderToScreen = true;
				composer.addPass( fxaa );

				window.addEventListener('resize', function(){
					fxaa.uniforms.resolution.value.set( 1 / renderer.domElement.width, 1 / renderer.domElement.height );
				});

			},

			update = function(timestep){

				frustum.setFromMatrix( tempMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );

				spheres.forEach(function(sphere){
					
					if( !frustum.intersectsObject( sphere.mesh ) ){
					
						sphere.mesh.position.y *= -1;
						while(!frustum.intersectsObject( sphere.mesh )){
							sphere.mesh.position.add(nudge);
							sphere.mesh.updateMatrix();
							sphere.mesh.updateMatrixWorld(true);
						}
						sphere.model.position.copy(sphere.mesh.position);
						sphere.model.clone(sphere.previousModel);
					
					}else{

						sphere.model.clone(sphere.previousModel);
						sphere.model.position.add(sphere.velocity);

					}
					
					

				})
				
			},
			
			draw = function(interpolation){

				spheres.forEach(function(sphere){
					sphere.mesh.position.lerpVectors(sphere.previousModel.position, sphere.model.position, interpolation);
				})

				composer.render();

			}

		return{
			init: init,
			update: update,
			draw: draw
		}
	}

}(window.ab = window.ab || {}))