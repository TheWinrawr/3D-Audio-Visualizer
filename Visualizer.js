/*Set up three.js*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*Set up Visualizer*/
var Visualizer = {

	visualName: "sphere",  //current active visual
	visualNameList: ["spectrum", "sphere"],

	setup: function() {

		var lights = [];
		lights[0] = new THREE.PointLight( 0xffffff, 0.6, 0 );
		lights[1] = new THREE.PointLight( 0xffffff, 0.6, 0 );

		lights[0].position.set( 200, 500, 200 );
		lights[1].position.set( -200, -500, -200 );

		scene.add( lights[0] );
		scene.add( lights[1] );

		this.Visuals[this.visualName].setup();
	},

	render: function(array) {
		this.Visuals[this.visualName].render(array);
	},

	clear: function() {
		var children = scene.children;
		console.log(children.length);
		for(var i = children.length - 1; i >= 0; i--) {
			scene.remove(children[i]);
		}
	}
};

Visualizer.Visuals = {
	
	"sphere": {

		numSamples: 1024,
		radius: 5,

		setup: function() {
			analyser.fftSize = this.numSamples;

			var geometry = new THREE.SphereGeometry(this.radius, 20, 20);
			//console.log(geometry.vertices.length);

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
					vertices[i].setLength(this.radius + array[i]/(200/this.radius));
				}
			}
		}
	},

	"spectrum": {

		numSamples: 64,

		setup: function() {
			analyser.fftSize = this.numSamples;

			this.spectrum = [];

			for(var i = 0; i < this.numSamples/2; i++) {
				var geometry = new THREE.BoxGeometry(1, 1, 1);

				var material = new THREE.MeshPhongMaterial({
					color: 0x00ff00,
					specular: 0xffffff
				});

				material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
				var cube = new THREE.Mesh(geometry, material);

				var spacing = 0.5;

				cube.position.x = i-((this.numSamples/2) * (1 + spacing))/2 + i*spacing;
				console.log(((numSamples/2) * (1.5))/2);
				this.spectrum.push(cube);
				scene.add(cube);
			}
		},

		render: function(array) {
			for(var i = 0; i < array.length; i++) {
				if(!this.spectrum[i]) continue;
				var scale = (array[i] !== 0 ? array[i]/30 + 1 : 1);
				var position = scale/2;

				this.spectrum[i].scale.z = scale;
				this.spectrum[i].position.z = position;
			}
		}
	}
};

camera.position.z = 20;


controls = new THREE.OrbitControls(camera, renderer.domElement);

var render = function(array, name) {
	array = frequencyData;
	name = "sphere";

	requestAnimationFrame(render);

	Visualizer.render(array);

	controls.update();
	renderer.render(scene, camera);
}

Visualizer.setup();
render();