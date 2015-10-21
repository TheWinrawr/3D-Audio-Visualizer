/*Set up three.js*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*Set up Visualizer*/
var Visualizer = [
	{
		name: "sphere",

		setup: function() {
			var geometry = new THREE.SphereGeometry(12, 20, 20);
			console.log(geometry.vertices.length);

			var material = new THREE.MeshPhongMaterial({
					color: 0x00ff00,
					specular: 0xffffff,
					shininess: 20,
					reflectivity: 5.5,
					morphTargets: true
			});

			this.sphere = new THREE.Mesh(geometry, material);
			scene.add(this.sphere);
		},

		render: function(array) {
			this.sphere.geometry.mergeVertices();
			this.sphere.geometry.verticesNeedUpdate = true;
			var vertices = this.sphere.geometry.vertices;
			for(var i = 0; i < vertices.length; i++) {
				if(array[i]) {
					vertices[i].setLength(12+array[i]/20);
				}
			}
		}
	},

	{
		name: "spectrum",

		setup: function() {
			this.spectrum = [];

			for(var i = 0; i < numSamples/2; i++) {
				var geometry = new THREE.BoxGeometry(1, 1, 1);

				var material = new THREE.MeshPhongMaterial({
					color: 0x00ff00,
					specular: 0xffffff,
					shininess: 20,
					reflectivity: 5.5
				});

				material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
				var cube = new THREE.Mesh(geometry, material);
				cube.position.x = i-24 + i*0.5;
				this.spectrum.push(cube);
				scene.add(cube);
			}
		},

		render: function(array) {
			for(var i = 0; i < array.length; i++) {
				var scale = (array[i] !== 0 ? array[i]/30 + 1 : 1);
				var position = scale/2;

				this.spectrum[i].scale.z = scale;
				this.spectrum[i].position.z = position;
			}
		}
	}
];

camera.position.z = 20;
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
directionalLight.position.set( 5, 5, 5 );
scene.add( directionalLight );

var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.8 );
directionalLight2.position.set( -5, -5, -5 );
scene.add( directionalLight2 );

controls = new THREE.OrbitControls(camera);

var render = function(array, name) {
	array = frequencyData;
	name = "sphere";

	requestAnimationFrame(render);

	for(var i = 0; i < Visualizer.length; i++) {
		if(Visualizer[i].name === name) {
			Visualizer[i].render(array);
		}
	}

	controls.update();
	renderer.render(scene, camera);
}

Visualizer[0].setup();
render();