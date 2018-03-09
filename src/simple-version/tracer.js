
var Tracer = {

addAxis: function(scene) {
	const material = new THREE.LineDashedMaterial(
		{color: 0x444444,
		 dashSize: 3,
		 gapSize: 1});
	const geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
	geometry.vertices.push(new THREE.Vector3(1000, 0, 0));
	geometry.computeLineDistances();
	axis = new THREE.Line(geometry, material);
	axis.name = 'axis';
	scene.add(axis);
},

addTraceLines: function() {
	this.tracePoints = [];
	this.traceLines = new THREE.Group();
	this.sceneWrapper.scene.add(this.traceLines);
},

startTracking: function(sceneWrapper) {
	this.sceneWrapper = sceneWrapper;
	this.addTraceLines();
	this.sceneWrapper.animations.push(this.trackPosition.bind(this));
	this.sceneWrapper.orbitControls.enabled = false;
},

stopTracking: function() {
	this.sceneWrapper.animations.pop();
	this.sceneWrapper.orbitControls.enabled = true;
},

removeTrace: function() {
	this.sceneWrapper.scene.remove(this.traceLines);
},

trackPosition: function() {
	const point = Input.getMouse3DCoordinates(this.sceneWrapper.camera);
	this.addPointToTrace(point);
},

addPointToTrace: function(point) {
	this.tracePoints.push(point);

	if(this.tracePoints.length >= 2) {
		const length = this.tracePoints.length;
		const line = this.getNewLine(this.tracePoints[length-2],
									this.tracePoints[length-1]);
		this.traceLines.add(line);
	}
},

closeTrace: function() {
	if(this.tracePoints.length >= 2) {
		const length = this.tracePoints.length;
		const line = this.getNewLine(this.tracePoints[0],
									this.tracePoints[length-1]);
		this.traceLines.add(line);
	}
},

getNewLine: function(firstPoint, secondPoint) {
	firstPoint = this.projectPointNearCamera(firstPoint);
	secondPoint = this.projectPointNearCamera(secondPoint);

	const geometry = new THREE.Geometry();
	geometry.vertices.push(firstPoint);
	geometry.vertices.push(secondPoint);
	const material = new THREE.LineBasicMaterial();
	return new THREE.Line(geometry, material);
},

projectPointNearCamera: function(point) {
	const newPoint = new THREE.Vector3();

	newPoint.add(point);
	newPoint.sub(this.sceneWrapper.camera.position);

	newPoint.multiplyScalar(0.2);

	newPoint.add(this.sceneWrapper.camera.position);

	return newPoint;
},

getTrace: function() {
	return this.tracePoints.slice();
},


};
