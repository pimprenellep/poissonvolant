
const EyesModeler = {
drawEyes: function(scene, camera, trace) {
	const upperX = Math.max(...trace.map(p => p.x));
	const lowerX = Math.min(...trace.map(p => p.x)); 

	const upperY = Math.max(...trace.map(p => p.y));
	const lowerY = Math.min(...trace.map(p => p.y)); 

	const centerX = (upperX + lowerX) / 2;
	const centerY = (upperY + lowerY) / 2;
	const center = {x: centerX, y: centerY};

	const radiusX = (upperX - lowerX) / 2;
	const radiusY = (upperY - lowerY) / 2;

	const xIsSmaller = radiusX < radiusY;

	const radius = Math.min(radiusX, radiusY);

	const direction = new THREE.Vector3(center.x - camera.position.x,
		center.y - camera.position.y, -camera.position.z);
	direction.normalize();

	const raycaster = new THREE.Raycaster(camera.position, direction);
	const intersections = raycaster.intersectObjects(scene.children);
	
	const zOffset = intersections[0].point.z;


	const resolution = 30;
	var geometry = new THREE.SphereGeometry(radius, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.7));

	if(xIsSmaller)
		geometry.applyMatrix(new THREE.Matrix4().makeScale(1, radiusY / radiusX, 1));
	else
		geometry.applyMatrix(new THREE.Matrix4().makeScale(radiusX / radiusY, 1, 1));

	var material = new THREE.MeshBasicMaterial();
	var rightEye = new THREE.Mesh(geometry, material);
	rightEye.position.set(centerX, centerY, zOffset);
	scene.add(rightEye);

	geometry = new THREE.SphereGeometry(radius/3, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.2));
	material = new THREE.MeshBasicMaterial({color: 0x000000});
	var rightIris = new THREE.Mesh(geometry, material);
	rightIris.position.set(0, 0, 0.7*radius);
	//rightIris.rotateY(-Math.PI/6);
	rightEye.add(rightIris);


	geometry = new THREE.SphereGeometry(radius, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.7));

	if(xIsSmaller)
		geometry.applyMatrix(new THREE.Matrix4().makeScale(1, radiusY / radiusX, 1));
	else
		geometry.applyMatrix(new THREE.Matrix4().makeScale(radiusX / radiusY, 1, 1));

	material = new THREE.MeshBasicMaterial();
	var leftEye = new THREE.Mesh(geometry, material);
	leftEye.position.set(centerX, centerY, -zOffset);
	scene.add(leftEye);


	geometry = new THREE.SphereGeometry(radius/3, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.2));
	material = new THREE.MeshBasicMaterial({color: 0x000000});
	leftIris = new THREE.Mesh(geometry, material);
	leftIris.position.set(0, 0, - 0.7*radius);
	//leftIris.rotateY(Math.PI/6);
	leftEye.add(leftIris);
},
};