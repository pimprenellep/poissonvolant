
WING_COLOR = 0xcccccc;
WING_OPACITY = 0.7;
WING_DEPTH = 1/50;

DOUBLE_FIN_COLOR = 0x993300;
FIN_OPACITY = 1;
FIN_DEPTH = 1/12;


const FinsModeler = {
drawFin: function(parent, camera, bodyPoints, points) {
	this.bodyPoints = bodyPoints;
	if(this.isSingleFin(points))
		this.drawSingleFin(parent, points);
	else
		this.drawPairOfFins(parent, camera, points);
},

addSingleFin: function(parent, finSpecs) {
	const finShape = new THREE.Shape(finSpecs.points);

	const depth = 1;
	const geometry = new THREE.ExtrudeGeometry(finShape, {amount: depth, bevelSize: 0});
	geometry.translate(0, 0, -depth/2);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1/12));
	//const geometry = new THREE.ShapeGeometry(finShape);
	const material = new THREE.MeshLambertMaterial( {color: 0x990000, side: THREE.DoubleSide} );
	const fin = new THREE.Mesh(geometry, material);
	fin.name = 'single-fin';
	parent.add(fin);
},

addWings: function(parents, specs) {
	specs.color = WING_COLOR;
	specs.opacity = WING_OPACITY;
	specs.depth = WING_DEPTH;
	specs.name = 'wing';
	this.addDoubleAppendices(parents, specs);
},

addDoubleFins: function(parents, specs) {
	specs.color = DOUBLE_FIN_COLOR;
	specs.opacity = FIN_OPACITY;
	specs.depth = FIN_DEPTH;
	specs.name = 'fin';
	this.addDoubleAppendices(parents, specs);
},

addDoubleAppendices: function(parents, specs) {
	const rightAppendix = this.makeAppendix(specs);
	specs.rotation *= -1;
	const leftAppendix = this.makeAppendix(specs);

	parents.right.add(rightAppendix);
	parents.left.add(leftAppendix);
},

makeAppendix: function(specs) {
	const shape = new THREE.Shape(specs.points);
	const depth = 1;
	const geometry = new THREE.ExtrudeGeometry(shape, {amount: depth, bevelSize: 0});
	geometry.translate(0, 0, -depth/2);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, specs.depth));

	const material = new THREE.MeshLambertMaterial( {color: specs.color, opacity: specs.opacity, transparent:true, side: THREE.DoubleSide} );
	const appendix = new THREE.Mesh(geometry, material);
	appendix.rotateX(specs.rotation);

	appendix.name = specs.name;
	return appendix;
},

};