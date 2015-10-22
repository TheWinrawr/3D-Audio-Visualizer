var gui = new dat.GUI();

var controller = gui.add(Visualizer, "visualName", Visualizer.visualNameList);

controller.onChange(function() {
	Visualizer.clear();
	Visualizer.setup();
})