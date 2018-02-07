
var sceneWrapper;

function start() {
	sceneWrapper = new SceneWrapper();
	startDrawFishBody();
}

function startDrawFishBody() {
	Tracer.addAxis(sceneWrapper.scene);
	Tracer.start(sceneWrapper, endDrawFishBody);
}

function endDrawFishBody() {
	FishModeler.drawBody(sceneWrapper.scene, Tracer.getTrace());
}


window.onload = start;