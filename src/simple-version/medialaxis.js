
const VORONOI_BOUNDS = 3000;

const MedialAxis = {
get: function(points) {
	const voronoi = new Voronoi();
	const boundingBox = {
		xl: -VORONOI_BOUNDS, xr: VORONOI_BOUNDS,
		yt: -VORONOI_BOUNDS, yb: VORONOI_BOUNDS,
	};

	const diagram = voronoi.compute(points, boundingBox);
	const medialAxisEdges = [];
	for(let edge of diagram.edges)
		if(this.insideRegion(edge, points))
			medialAxisEdges.push(edge);
	return medialAxisEdges;
},

insideRegion: function(edge, points) {
	return this.pointInsideRegion(edge.va, points) && this.pointInsideRegion(edge.vb, points);
},

pointInsideRegion: function(point, region) {
	let windingNumber = 0;
	const xInfinity = {x: 1e5, y: 0};
	for(let i = 0; i != region.length; ++i) {
		let j = (i + 1) % region.length;
		if(this.intersects(point, xInfinity, region[i], region[j]))
			windingNumber += region[i].y <= region[j].y ? 1 : -1;		
	}
	return this.mod(windingNumber, 2) == 1;
},

mod: function(n, k){
	return ((n % k) + k) % k;
},

cross: function(a, b, c) {
	return (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
},

intersects: function(p1, p2, q1, q2) {
	const crossq1 = this.cross(p1, p2, q1);
	const crossq2 = this.cross(p1, p2, q2);
	const crossp1 = this.cross(q1, q2, p1);
	const crossp2 = this.cross(q1, q2, p2);
	return crossq1 * crossq2 < 0 && crossp1 * crossp2 < 0;

},

};