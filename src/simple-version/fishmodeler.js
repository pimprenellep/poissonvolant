
const USING_TEXTURE = false;

const FishModeler = {

drawBody: function(scene, trace) {
	const splinePoints = this.smoothPoints(trace);

	for(let point of splinePoints)
		this.rotate(point);

	var geometry = new THREE.LatheGeometry(splinePoints);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI/2));
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.3));

	var material;
	if(USING_TEXTURE)
		material = new THREE.MeshBasicMaterial(
			{side:THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('./../data/fish-texture-rot.jpg')});
	else
		material = new THREE.MeshNormalMaterial(
			{side:THREE.DoubleSide});

	fish = new THREE.Mesh(geometry, material);
	fish.name = 'fish-body';
	scene.add(fish);
},

smoothPoints: function(points){
	const spline = new THREE.SplineCurve(points);
	const numSamplePoints = 30;
	return spline.getPoints(numSamplePoints);
},

rotate: function(point) {
	point.set(-point.y, point.x);
}
};