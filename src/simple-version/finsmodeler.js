
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
	fin.name = 'fin';
	parent.add(fin);
},

/*
addDoubleFins: function(parent, camera, finSpecs) {
	var points = finSpecs.points;

	const contact = {x: (points[0].x + points[points.length-1].x)/2,
					 y: (points[0].y + points[points.length-1].y)/2,}

	points = points.map(p => new THREE.Vector2(p.x - contact.x, p.y - contact.y));

	const direction = new THREE.Vector3(contact.x - camera.position.x,
		contact.y - camera.position.y, -camera.position.z);
	direction.normalize();

	
	const raycaster = new THREE.Raycaster(camera.position, direction);
	const intersections = raycaster.intersectObjects(parent.children);
	let zOffset = 0;
	if(intersections.length >= 1)
	zOffset = intersections[0].point.z;
	
	const finShape = new THREE.Shape(points);
	
	const pivot = new THREE.Group();
	pivot.position.set(contact.x, contact.y, -zOffset);
	parent.add(pivot);
	
	const upperX = Math.max(...points.map(p => p.x));
	const lowerX = Math.min(...points.map(p => p.x));
	const upperY = Math.max(...points.map(p => p.y));
	const lowerY = Math.min(...points.map(p => p.y));
	const upperDist = Math.abs(upperY);
	const lowerDist = Math.abs(lowerY);
	var isDirectedUpwards = upperDist > lowerDist;
	
	const width = Math.abs(upperX - lowerX);
	const height = Math.abs(upperY - lowerY);
	var rotationAngle = Math.atan(height / width) - Math.PI/2;
	if(!isDirectedUpwards) 
	rotationAngle *= -1;
	
	var color;
	var opacity;
	var finWidth;
	if(isDirectedUpwards) {
		color = 0xcccccc;
		opacity = 0.7;
		finWidth = 1/50;
	}
	else {
		color = 0x993300;
		opacity = 1;
		finWidth = 1/12;
	}
	
	
	//const geometry = new THREE.ShapeGeometry(finShape);
	

	const finShape2 = new THREE.Shape(points);

	const pivot2 = new THREE.Group();
	pivot2.position.set(contact.x, contact.y, zOffset);
	parent.add(pivot2);

	//const geometry2 = new THREE.ShapeGeometry(finShape);

	const geometry2 = new THREE.ExtrudeGeometry(finShape2, {amount: depth, bevelSize: 0});
	geometry2.translate(0, 0, -depth/2);
	geometry2.applyMatrix(new THREE.Matrix4().makeScale(1, 1, finWidth));

	const material2 = new THREE.MeshLambertMaterial( {color: color, opacity: opacity, transparent:true, side: THREE.DoubleSide} );
	const fin2 = new THREE.Mesh(geometry2, material2);
	fin2.rotateX(-rotationAngle);
	fin.name = 'fin2';
	pivot2.add(fin2);

},
//*/

addWings: function(parent, specs) {
	specs.color = WING_COLOR;
	specs.opacity = WING_OPACITY;
	specs.depth = WING_DEPTH;
	this.addDoubleAppendices(parent, specs);
},

addDoubleFins: function(parent, specs) {
	specs.color = DOUBLE_FIN_COLOR;
	specs.opacity = FIN_OPACITY;
	specs.depth = FIN_DEPTH;
	this.addDoubleAppendices(parent, specs);
},

addDoubleAppendices: function(parent, specs) {
	this.addAppendix(parent, specs);
	specs.contact.z *= -1;
	specs.rotation *= -1;
	this.addAppendix(parent, specs);
},

addAppendix: function(parent, specs) {
	const pivot = new THREE.Group();
	pivot.position.copy(specs.contact);

	const shape = new THREE.Shape(specs.points);
	const depth = 1;
	const geometry = new THREE.ExtrudeGeometry(shape, {amount: depth, bevelSize: 0});
	geometry.translate(0, 0, -depth/2);
	geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, specs.depth));

	const material = new THREE.MeshLambertMaterial( {color: specs.color, opacity: specs.opacity, transparent:true, side: THREE.DoubleSide} );
	const appendix = new THREE.Mesh(geometry, material);
	appendix.rotateX(specs.rotation);
	parent.add(pivot);
	pivot.add(appendix);
},

};