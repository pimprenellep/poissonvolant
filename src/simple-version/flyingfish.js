var camera;
var renderer;
var scene;

var sphere;
var mouse;
var fish;
var axis;

var markedPoints;
var controls;

var orbitControls;

var drawingFishBody;

function run() {
	init();
	animate();
}

function init() {
	initCamera();
	initRenderer();
	initScene();
	initOthers();
}

function initCamera() {
	const angle = 60;
	const ratio = window.innerWidth/window.innerHeight;
	const nearClippingDist = 1;
	const farClippingDist = 2000;
	camera = new THREE.PerspectiveCamera(angle, ratio, nearClippingDist, farClippingDist);
	camera.position.z = 100;
	camera.lookAt(new THREE.Vector3(0,0,0));
}

function initRenderer() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function initScene() {
	scene = new THREE.Scene();
	addAxis();
}

function addAxis() {
	const material = new THREE.LineDashedMaterial(
		{color: 0x444444,
		 dashSize: 3,
		 gapSize: 1});
	const geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
	geometry.vertices.push(new THREE.Vector3(1000, 0, 0));
	geometry.computeLineDistances();
	axis = new THREE.Line(geometry, material);
	scene.add(axis);
}

function stopDrawingFishBody() {
	drawingFishBody = false;
	makeFishFromContour();
	removeTrace();
}

function makeFishFromContour() {
	const splinePoints = smoothPoints(markedPoints);

	var geometry = new THREE.LatheGeometry(splinePoints);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI/2));
	var material = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
	fish = new THREE.Mesh(geometry, material);
	scene.add(fish);
	orbitControls.enabled = true;
}

function smoothPoints(points){
	const spline = new THREE.SplineCurve(points);
	const numSamplePoints = 30;
	return spline.getPoints(numSamplePoints);
}

function initOthers() {
	mouse = new THREE.Vector2();
	markedPoints = [];
	orbitControls = new THREE.OrbitControls( camera );
	orbitControls.enabled = false;
	drawingFishBody = true;
}

function animate() {
	requestAnimationFrame(animate);

	processInput();

	renderer.render(scene, camera);
}

function processInput() {
	for(key in keyCommand)
		if(isPressed[key])
			keyCommand[key]();
}

function onMouseDown(event) {
	isPressed['mouseLeftButton'] = true;
}
document.addEventListener('mousedown', onMouseDown);

function onMouseUp(event) {
	isPressed['mouseLeftButton'] = false;

	if(drawingFishBody) 
		stopDrawingFishBody();
}
document.addEventListener('mouseup', onMouseUp);

function onMouseMove(event) {
	mouse.x = 2*(event.clientX/window.innerWidth) - 1
	mouse.y = (-1) * (2*(event.clientY/window.innerHeight) - 1);
}
document.addEventListener('mousemove', onMouseMove);

var isPressed = {}
var keyCommand = {}

document.onkeydown = document.onkeyup = function (event) {
    isPressed[event.key] = event.type == 'keydown';
};

var tracePoints = [];
var traceLines = [];
function addPointToTrace(point) {
	tracePoints.push(point);

	if(tracePoints.length >= 2) {
		const line = getNewLine(tracePoints[tracePoints.length-2],
								tracePoints[tracePoints.length-1]);
		scene.add(line);
		traceLines.push(line);
	}
}

function getNewLine(firstPoint, secondPoint) {
	const geometry = new THREE.Geometry();
	geometry.vertices.push(firstPoint);
	geometry.vertices.push(secondPoint);
	const material = new THREE.LineBasicMaterial();
	return new THREE.Line(geometry, material);
}


function removeTrace() {
	for(let line of traceLines)
		scene.remove(line);
}

function getMouse3DPoint() {
	const point = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	point.unproject(camera);
	point.sub(camera.position);
	point.multiplyScalar(-camera.position.z/point.z);
	point.add(camera.position);
	return point;
}

function markPoint() {
	if(drawingFishBody) {
		const point = getMouse3DPoint();
		markedPoints.push(new THREE.Vector2(-point.y, point.x));

		addPointToTrace(point);
	}
}
keyCommand['mouseLeftButton'] = markPoint;



window.onload = run;