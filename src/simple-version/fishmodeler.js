
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
			{side:THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('./../data/fish2-body.jpg')});
	else
		material = new THREE.MeshNormalMaterial(
			{side:THREE.DoubleSide});

	fish = new THREE.Mesh(geometry, material);
	fish.name = 'fish-body';
	scene.add(fish);
},

smoothPoints: function(points){
	const spline = new THREE.SplineCurve(points);
	const numSamplePoints = 50;
	return spline.getPoints(numSamplePoints);
},

rotate: function(point) {
	point.set(-point.y, point.x);
},

drawFin: function(scene, points) {
	if(this.isSingleFin(points))
		this.drawSingleFin(scene, points);
	else
		this.drawPairOfFins(scene, points);
},

isSingleFin: function(points) {
	return false;
},

drawSingleFin: function(scene, points) {
	const finShape = new THREE.Shape(points);

	const geometry = new THREE.ShapeGeometry(finShape);
	const material = new THREE.MeshBasicMaterial( {color: 0x990000, side: THREE.DoubleSide} );
	const fin = new THREE.Mesh(geometry, material);
	fin.name = 'fin';
	scene.add(fin);
},

drawPairOfFins: function(scene, points) {
	const finShape = new THREE.Shape(points);

	const geometry = new THREE.ShapeGeometry(finShape);
	const material = new THREE.MeshBasicMaterial( {color: 0x993300, side: THREE.DoubleSide} );
	const fin = new THREE.Mesh(geometry, material);
	fin.rotateX(Math.PI/10);
	fin.name = 'fin';
	scene.add(fin);

	const finShape2 = new THREE.Shape(points);

	const geometry2 = new THREE.ShapeGeometry(finShape);
	const material2 = new THREE.MeshBasicMaterial( {color: 0x993300, side: THREE.DoubleSide} );
	const fin2 = new THREE.Mesh(geometry2, material2);
	fin2.rotateX(-Math.PI/10);
	fin.name = 'fin2';
	scene.add(fin2);


},
};