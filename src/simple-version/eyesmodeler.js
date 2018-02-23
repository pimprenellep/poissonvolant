
const EyesModeler = {
drawEyes: function(scene, camera, trace) {
	const centerX = trace.map(p => p.x).reduce((a, b) => a+b) / trace.length;
	const centerY = trace.map(p => p.y).reduce((a, b) => a+b) / trace.length;
	const center = {x: centerX, y: centerY};
	const avgDist = trace.map(p => Math.sqrt(dist2(p, center))).reduce((a,b) => a+b) / trace.length;


	const direction = new THREE.Vector3(center.x - camera.position.x,
		center.y - camera.position.y, -camera.position.z);
	direction.normalize();

	const raycaster = new THREE.Raycaster(camera.position, direction);
	const intersections = raycaster.intersectObjects(scene.children);
	
	const zOffset = intersections[0].point.z;


	const resolution = 30;
	var geometry = new THREE.SphereGeometry(avgDist, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.7));
	var material = new THREE.MeshBasicMaterial();
	var rightEye = new THREE.Mesh(geometry, material);
	rightEye.position.set(centerX, centerY, zOffset);
	scene.add(rightEye);

	geometry = new THREE.SphereGeometry(avgDist/3, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.2));
	material = new THREE.MeshBasicMaterial({color: 0x000000});
	var rightIris = new THREE.Mesh(geometry, material);
	rightIris.position.set(0, 0, 0.7*avgDist);
	//rightIris.rotateY(-Math.PI/6);
	rightEye.add(rightIris);


	geometry = new THREE.SphereGeometry(avgDist, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.7));
	material = new THREE.MeshBasicMaterial();
	var leftEye = new THREE.Mesh(geometry, material);
	leftEye.position.set(centerX, centerY, -zOffset);
	scene.add(leftEye);


	geometry = new THREE.SphereGeometry(avgDist/3, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.2));
	material = new THREE.MeshBasicMaterial({color: 0x000000});
	leftIris = new THREE.Mesh(geometry, material);
	leftIris.position.set(0, 0, - 0.7*avgDist);
	//leftIris.rotateY(Math.PI/6);
	leftEye.add(leftIris);
},
};