
const EyesModeler = {
addEyes: function(parents, eyeSpecs) {
	const rightEye = this.makeRightEye(eyeSpecs);
	const leftEye = this.makeLeftEye(eyeSpecs);

	parents.right.add(rightEye);
	parents.left.add(leftEye);
},

makeRightEye: function(eyeSpecs) {
	return this.makeEye(eyeSpecs, true);
},

makeLeftEye: function(eyeSpecs) {
	return this.makeEye(eyeSpecs, false);
},

makeEye: function(eyeSpecs, isRight) {
	const center = eyeSpecs.center;
	const radiusX = eyeSpecs.radiusX;
	const radiusY = eyeSpecs.radiusY;

	const xIsSmaller = radiusX <= radiusY;
	const radius = Math.min(radiusX, radiusY);

	const resolution = 30;
	var geometry = new THREE.SphereGeometry(radius, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.7));

	if(xIsSmaller)
		geometry.applyMatrix(new THREE.Matrix4().makeScale(1, radiusY / radiusX, 1));
	else
		geometry.applyMatrix(new THREE.Matrix4().makeScale(radiusX / radiusY, 1, 1));

	var material = new THREE.MeshBasicMaterial();
	var eye = new THREE.Mesh(geometry, material);

	geometry = new THREE.SphereGeometry(radius/3, resolution, resolution);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.2));
	material = new THREE.MeshBasicMaterial({color: 0x000000});
	var iris = new THREE.Mesh(geometry, material);
	iris.position.set(0, 0, 0.7*radius);
	//iris.rotateY(-Math.PI/6);
	eye.add(iris);

	if(!isRight) {
		iris.position.z = -iris.position.z;
	}
	
	return eye;
},

};