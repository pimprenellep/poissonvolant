
var sceneWrapper;

function start() {
	sceneWrapper = new SceneWrapper();
	startDrawing();
}

function startDrawing() {
	Tracer.addAxis(sceneWrapper.scene);
	Tracer.start(sceneWrapper, addMedialAxis);
}

function addMedialAxis() {
	Tracer.closeTrace();
	medialAxisEdges = MedialAxis.get(Tracer.getTrace());
	addEdgesToScene(medialAxisEdges);
}

function addEdgesToScene(edges) {
	const linesGroup = new THREE.Group();
	sceneWrapper.scene.add(linesGroup);

	for(let edge of edges) {
		const geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3(edge.va.x, edge.va.y, 0),
			new THREE.Vector3(edge.vb.x, edge.vb.y, 0),
			);
		const material = new THREE.LineBasicMaterial({color: 0xff0055});
		const line = new THREE.Line(geometry, material);
		linesGroup.add(line);
	}	
 }


window.onload = start;