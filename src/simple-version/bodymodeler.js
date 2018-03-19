
const USING_TEXTURE = true;

const BodyModeler = {

addBody: function(parent, trace) {
	const splinePoints = this.smoothPoints(trace);

	for(let point of splinePoints)
		this.rotate(point);

	var geometry = new THREE.LatheGeometry(splinePoints);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI/2));
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0.3));

	setUniformUVCoords(geometry);

	var material;

	if(USING_TEXTURE)
		material = new THREE.MeshBasicMaterial(
			{side:THREE.DoubleSide, map: this.getBodyTexture()});
	else
		material = new THREE.MeshNormalMaterial(
			{side:THREE.DoubleSide});

	fish = new THREE.Mesh(geometry, material);
	fish.name = 'body';
	parent.add(fish);
},

smoothPoints: function(points){
	const spline = new THREE.SplineCurve(points);
	const numSamplePoints = 50;
	return spline.getPoints(numSamplePoints);
},

rotate: function(point) {
	point.set(-point.y, point.x);
},

getBodyTexture: function() {
	const texture = new THREE.TextureLoader().load('./../data/fish-torrique.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 10, 10 );
	return texture;
},

};

function dist2(p, q) { 
	return (p.x - q.x)**2 + (Math.abs(p.y) - Math.abs(q.y))**2;
}

function setUniformUVCoords(geometry) {
	geometry.uvsNeedUpdate = true;
	var n = geometry.faceVertexUvs[0].length;
	
	for(var k=0; k<n; k++){
		var face = geometry.faces[k];
		var a = face.a;
		var pointa = geometry.vertices[face.a];
		var pointb = geometry.vertices[face.b];
		var pointc = geometry.vertices[face.c];
		geometry.faceVertexUvs[0][k][0] = new THREE.Vector2(pointa.x/100,pointa.y/100);
		geometry.faceVertexUvs[0][k][1] = new THREE.Vector2(pointb.x/100,pointb.y/100);
		geometry.faceVertexUvs[0][k][2] = new THREE.Vector2(pointc.x/100,pointc.y/100);
	}
}