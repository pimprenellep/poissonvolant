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

var trace;

function run() {
	init();
	animate();
}

function init() {
	initCamera();
	initRenderer();
	initScene();
	initControls();
	initOthers();
}

function initCamera() {
	const nearClippingDist = 30;
	const farClippingDist = 2000;
	//camera = new THREE.OrthographicCamera(-window.innerWidth/2,
	//	window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2);
	camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
}

function initRenderer() {
	renderer = new THREE.WebGLRenderer();
	let canvasSize = Math.min(window.innerWidth, window.innerHeight);
	renderer.setSize( canvasSize,canvasSize );
	document.body.appendChild(renderer.domElement);
}

function initScene() {
	scene = new THREE.Scene();
	addSphere();
	addAxis();
	addTrace();
}

function addSphere() {
	const length = 0.1;
	const resolution = 64;
	const geometry = new THREE.SphereGeometry(length, resolution, resolution);
	const material = new THREE.MeshNormalMaterial();
	sphere = new THREE.Mesh(geometry, material);
	//scene.add(sphere);
}

function addTrace() {
	const material = new THREE.LineDashedMaterial({color: 0x444444});
	const geometry = new THREE.Geometry();
	trace = new THREE.Line(geometry, material);
	scene.add(trace);
}

function addAxis() {
	const material = new THREE.LineDashedMaterial({color: 0x444444});
	const geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometry.vertices.push(new THREE.Vector3(1, 0, 0));
	axis = new THREE.Line(geometry, material);
	scene.add(axis);
}

function initControls() {
	controls = {'makeFishFromContour': makeFishFromContour};
	var gui = new dat.GUI();
	gui.add(controls, 'makeFishFromContour');
}

function makeFishFromContour() {
	var geometry = new THREE.LatheGeometry(markedPoints);
	var material = new THREE.MeshNormalMaterial();
	fish = new THREE.Mesh(geometry, material);
	fish.rotation.z = Math.PI/2;
	scene.add(fish);
	console.log(fish);
}

function initOthers() {
	mouse = new THREE.Vector2();
	markedPoints = [];
	orbitControls = new THREE.OrbitControls( camera );
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
}
document.addEventListener('mouseup', onMouseUp);

function onMouseMove(event) {
	mouse.x = 2*(event.clientX/window.innerHeight) - 1
	mouse.y = (-1) * (2*(event.clientY/window.innerHeight) - 1);
}
document.addEventListener('mousemove', onMouseMove);

isPressed = {}
keyCommand = {}

document.onkeydown = document.onkeyup = function (event) {
    isPressed[event.key] = event.type == 'keydown';
};

keyCommand['mouseLeftButton'] = function() {
	if(!isPressed['Control'])
		return;
	markedPoints.push(new THREE.Vector2(mouse.y, -mouse.x));
	trace.geometry.vertices.push(new THREE.Vector3(mouse.y, -mouse.x, 0));
	trace.geometry.verticesNeedUpdate = true;
}

window.onload = run;