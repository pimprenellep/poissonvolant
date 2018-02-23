
const FinsModeler = {
drawFin: function(scene, camera, bodyPoints, points) {
	this.bodyPoints = bodyPoints;
	if(this.isSingleFin(points))
		this.drawSingleFin(scene, points);
	else
		this.drawPairOfFins(scene, camera, points);
},

isSingleFin: function(points) {
	return this.isCloseToBorder(points[0]) && this.isCloseToBorder(points[points.length-1]);
},

isCloseToBorder: function(point) {
	const bodyWidth = Math.max(...this.bodyPoints.map(p => p.x)) 
					- Math.min(...this.bodyPoints.map(p => p.x));
	const bodyHeight = 2*Math.max(...this.bodyPoints.map(p => p.y)); 

	let closestPoint = null;
	let minDist = 1e10;
	for(let bodyPoint of this.bodyPoints) {
		if(dist2(bodyPoint, point) < minDist**2) {
			minDist = Math.sqrt(dist2(bodyPoint, point));
			closestPoint = bodyPoint;
		}
	}

	const THRESHOLD = 0.15;
	const distX = Math.abs(point.x - closestPoint.x);
	const distY = Math.abs(Math.abs(point.y) - Math.abs(closestPoint.y));

	return (distX < THRESHOLD * bodyWidth 
		 && distY < THRESHOLD * bodyHeight);
},	

drawSingleFin: function(scene, points) {
	const finShape = new THREE.Shape(points);

	const geometry = new THREE.ShapeGeometry(finShape);
	const material = new THREE.MeshBasicMaterial( {color: 0x990000, side: THREE.DoubleSide} );
	const fin = new THREE.Mesh(geometry, material);
	fin.name = 'fin';
	scene.add(fin);
},

drawPairOfFins: function(scene, camera, points) {
	const contact = {x: (points[0].x + points[points.length-1].x)/2,
					 y: (points[0].y + points[points.length-1].y)/2,}
	const direction = new THREE.Vector3(contact.x - camera.position.x,
		contact.y - camera.position.y, -camera.position.z);
	direction.normalize();

	points = points.map(p => new THREE.Vector2(p.x - contact.x, p.y - contact.y));

	const raycaster = new THREE.Raycaster(camera.position, direction);
	const intersections = raycaster.intersectObjects(scene.children);
	let zOffset = 0;
	if(intersections.length >= 1)
		zOffset = intersections[0].point.z;

	const finShape = new THREE.Shape(points);

	const pivot = new THREE.Group();
	pivot.position.set(contact.x, contact.y, -zOffset);
	scene.add(pivot);

	const geometry = new THREE.ShapeGeometry(finShape);
	const material = new THREE.MeshBasicMaterial( {color: 0x993300, side: THREE.DoubleSide} );
	const fin = new THREE.Mesh(geometry, material);
	fin.rotateX(Math.PI/10);
	fin.name = 'fin';
	pivot.add(fin);

	const finShape2 = new THREE.Shape(points);

	const pivot2 = new THREE.Group();
	pivot2.position.set(contact.x, contact.y, zOffset);
	scene.add(pivot2);

	const geometry2 = new THREE.ShapeGeometry(finShape);
	const material2 = new THREE.MeshBasicMaterial( {color: 0x993300, side: THREE.DoubleSide} );
	const fin2 = new THREE.Mesh(geometry2, material2);
	fin2.rotateX(-Math.PI/10);
	fin.name = 'fin2';
	pivot2.add(fin2);

},
};