
const VORONOI_BOUNDS = 3000;

const MedialAxis = {
get: function(points) {
	const voronoi = new Voronoi();
	const boundingBox = {
		xl: -VORONOI_BOUNDS, xr: VORONOI_BOUNDS,
		yt: -VORONOI_BOUNDS, yb: VORONOI_BOUNDS,
	};
	this.calculateSharpBoundingBox(points);

	const diagram = voronoi.compute(points, boundingBox);
	const medialAxisEdges = [];
	for(let edge of diagram.edges)
		if(this.insideRegion(edge, points))
			medialAxisEdges.push(this.convertToVectors(edge));
	return medialAxisEdges;
},

calculateSharpBoundingBox(points) {
	this.bounds = {};
	this.bounds.xMin = Math.min(...points.map(point => point.x));
	this.bounds.xMax = Math.max(...points.map(point => point.x));
	this.bounds.yMin = Math.min(...points.map(point => point.y));
	this.bounds.yMax = Math.max(...points.map(point => point.y));
},

convertToVectors: function(edge) {
	return edge;
},

insideRegion: function(edge, points) {
	//return true;
	return this.edgeInsideBounds(edge) && !this.intersectsContour(edge, points);
},

edgeInsideBounds: function(edge) {
	return this.pointInsideBounds(edge.va) && this.pointInsideBounds(edge.vb);
},

pointInsideBounds: function(point) {
	return (this.bounds.xMin <= point.x && point.x <= this.bounds.xMax
		 && this.bounds.yMin <= point.y && point.y <= this.bounds.yMax);
},

intersectsContour: function(edge, points) {
	for(let i = 0; i != points.length; ++i) {
		let j = (i + 1) % points.length;
		if(this.intersects(edge.va, edge.vb, points[i], points[j]))
			return true;
	}
	return false;
},

cross: function(a, b, c) {
	return (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
},

intersects: function(p1, p2, q1, q2) {
	const crossq1 = this.cross(p1, p2, q1);
	const crossq2 = this.cross(p1, p2, q2);
	const crossp1 = this.cross(q1, q2, p1);
	const crossp2 = this.cross(q1, q2, p2);
	return crossq1 * crossq2 <= 0 && crossp1 * crossp2 <= 0;

},

};