
var sceneWrapper;
var bodyPoints;

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
	bodyPoints = Tracer.getTrace();
	BodyModeler.drawBody(sceneWrapper.scene, bodyPoints);
	startDrawingFins();
}

var isDrawingFins;
function startDrawingFins() {
	isDrawingFins = true;
	Input.keyCommand[' '] = function() { isDrawingFins = false };
	startDrawingOnePart();
}

function startDrawingOnePart() {
	Tracer.start(sceneWrapper, finishOnePart);
}

function finishOnePart() {
	Tracer.removeTrace(sceneWrapper.scene);
	if(isDrawingFins) {
		FinsModeler.drawFin(sceneWrapper.scene, sceneWrapper.camera, bodyPoints, Tracer.getTrace());
		startDrawingOnePart();
	} else {
		EyesModeler.drawEyes(sceneWrapper.scene, sceneWrapper.camera, Tracer.getTrace());
	}
}

window.onload = start;