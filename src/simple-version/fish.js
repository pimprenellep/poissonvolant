
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
	Tracer.removeTrace(sceneWrapper.scene);
	FishModeler.drawBody(sceneWrapper.scene, Tracer.getTrace());
	startDrawingFins();
}

var isDrawingFins;
function startDrawingFins() {
	isDrawingFins = true;
	Input.keyCommand['v'] = function() { isDrawingFins = false };
	startDrawingOneFin();
}

function startDrawingOneFin() {
	Tracer.start(sceneWrapper, finishOneFin);
}

function finishOneFin() {
	Tracer.removeTrace(sceneWrapper.scene);
	if(isDrawingFins) {
		FishModeler.drawFin(sceneWrapper.scene, Tracer.getTrace());
		startDrawingOneFin();
	}
}


window.onload = start;