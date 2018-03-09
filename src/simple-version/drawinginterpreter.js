
class DrawingInterpreter {
    constructor(sceneWrapper, fish) {
        this.sceneWrapper = sceneWrapper;
        this.fish = fish;
        this.interpretationCounter = 0;
    }

    interpret(points) {
        this.interpretationCounter += 1;
        if(this.isBody(points))
            return this.interpretBody(points);
        else if(this.isEye(points))
            return this.interpretEye(points);
        else if (this.isSingleFin(points))
            return this.interpretSingleFin(points);
        else if (this.isDirectedUpwards(points))
            return this.interpretWings(points);
        else
            return this.interpretDoubleFins(points);
    }

    isBody(points)  {
        return this.interpretationCounter == 1;
    }

    isEye(points) {
        return this.isCenterInBody(points) && (
            this.selfIntersects(points) || this.extremitiesClose(points) && this.almostSelfIntersects(points));
    }

    isCenterInBody(points) {
        const upperX = Math.max(...points.map(p => p.x));
        const lowerX = Math.min(...points.map(p => p.x)); 
        const centerX = (upperX + lowerX) / 2;

        const upperY = Math.max(...points.map(p => p.y));
        const lowerY = Math.min(...points.map(p => p.y)); 
        const centerY = (upperY + lowerY) / 2;

        const center = new THREE.Vector3(centerX, centerY, 0);
        
        const camera = this.sceneWrapper.camera;
        const direction = new THREE.Vector3(center.x - camera.position.x,
                         center.y - camera.position.y, -camera.position.z);
        direction.normalize();
        const raycaster = new THREE.Raycaster(camera.position, direction);
        const intersections = raycaster.intersectObjects(this.fish.fishOrigin.children);

        return intersections.length >= 1;
    }

    extremitiesClose(points) {
        const totalLength = this.getTraceLength(points);
        const dist = (p, q) => Math.sqrt((p.x - q.x)**2 + (p.y - q.y)**2);
        const threshold = 0.1;
        return dist(points[0], points[points.length - 1]) < threshold * totalLength;
    }

    almostSelfIntersects(points) {
        const extendedPoints = this.extendPoints(points);
        return this.selfIntersects(extendedPoints);
    }

    extendPoints(points) {
        const extensionRate = 0.05;
        const totalLength = this.getTraceLength(points);
        const extensionLength = extensionRate * totalLength;
        const dist = (p, q) => Math.sqrt((p.x - q.x)**2 + (p.y - q.y)**2);

        var otherIndex = null;
        var length = 0;
        for(let i = 0; i != points.length - 1; ++i) {
            length += dist(points[i], points[i+1]);
            if(length > extensionLength) {
                otherIndex = i + 1;
                break;
            }
        }
        const extendedBegin = this.extendSegment(points[otherIndex], points[0], extensionLength);

        otherIndex = null;
        length = 0;
        for(let i = points.length - 1; i > 0; --i) {
            length += dist(points[i], points[i-1]);
            if(length > extensionLength) {
                otherIndex = i - 1;
                break;
            }
        }

        const extendedEnd = this.extendSegment(points[otherIndex], points[points.length - 1], extensionLength);
        const extendedPoints = [extendedBegin].concat(points).concat([extendedEnd]);
        return extendedPoints;
    }

    extendSegment(firstPoint, secondPoint, distance) {
        const direction = secondPoint.clone();
        direction.sub(firstPoint);
        direction.multiplyScalar(distance/direction.length());
        direction.add(secondPoint);
        return direction;
    }

    selfIntersects(points) {
        for(let i = 0; i != points.length - 1; ++i) 
            for(let j = i+2; j < points.length - 1; ++j) 
                if(this.intersects(points[i], points[i+1], points[j], points[j+1])) {
                    return true;
                }
        return false;
    }

    cross(a, b, c) {
        return (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);
    }
    
    intersects(p1, p2, q1, q2) {
        const crossq1 = this.cross(p1, p2, q1);
        const crossq2 = this.cross(p1, p2, q2);
        const crossp1 = this.cross(q1, q2, p1);
        const crossp2 = this.cross(q1, q2, p2);
        return crossq1 * crossq2 < 0 && crossp1 * crossp2 < 0;
    
    }

    getTraceLength(points) {
        const dist = (p, q) => Math.sqrt((p.x - q.x)**2 + (p.y - q.y)**2);
        var traceLength = 0;
        for(let i = 0; i != points.length - 1; ++i)
            traceLength += dist(points[i], points[i+1]);
        return traceLength;
    }

    interpretBody(points) {
        return FishPartSpecification.getBodySpecs(points);
    }

    interpretSingleFin(points) {
        return FishPartSpecification.getSingleFinSpecs(points);
    }

    interpretEye(points) {
        const [center, radiusX, radiusY] = this.findEyeCenterAndSize(points);
        return FishPartSpecification.getEyeSpecs(center, radiusX, radiusY);
    }

    interpretDoubleFins(points) {
        const contact = this.findContactPoint(points);
        const rotation = this.findRotation(points, contact);
        points = points.map(p => new THREE.Vector2(p.x - contact.x, p.y - contact.y));
        return FishPartSpecification.getDoubleFinSpecs(points, contact, rotation);
    }

    interpretWings(points) {
        const contact = this.findContactPoint(points);
        const rotation = this.findRotation(points, contact);
        points = points.map(p => new THREE.Vector2(p.x - contact.x, p.y - contact.y));
        return FishPartSpecification.getWingSpecs(points, contact, rotation);
    }

    findEyeCenterAndSize(points) {
        const upperX = Math.max(...points.map(p => p.x));
        const lowerX = Math.min(...points.map(p => p.x)); 

        const upperY = Math.max(...points.map(p => p.y));
        const lowerY = Math.min(...points.map(p => p.y)); 

        const centerX = (upperX + lowerX) / 2;
        const centerY = (upperY + lowerY) / 2;
        const center = new THREE.Vector3(centerX, centerY, 0);

        const radiusX = (upperX - lowerX) / 2;
        const radiusY = (upperY - lowerY) / 2;

        const xIsSmaller = radiusX < radiusY;

        const radius = Math.min(radiusX, radiusY);

        const camera = this.sceneWrapper.camera;
        const scene = this.sceneWrapper.scene;

        const direction = new THREE.Vector3(center.x - camera.position.x,
                         center.y - camera.position.y, -camera.position.z);
        direction.normalize();

        const raycaster = new THREE.Raycaster(camera.position, direction);
        const intersections = raycaster.intersectObjects(this.fish.fishOrigin.children);
        
        center.z = intersections[0].point.z;

        return [center, radiusX, radiusY];
    }

    isSingleFin(points) {
        return this.isCloseToBorder(points[0]) && this.isCloseToBorder(points[points.length-1]);
    }
    
    isCloseToBorder(point) {
        const bodyWidth = Math.max(...this.fish.bodyPoints.map(p => p.x)) 
                        - Math.min(...this.fish.bodyPoints.map(p => p.x));
        const bodyHeight = 2*Math.max(...this.fish.bodyPoints.map(p => p.y)); 
    
        let closestPoint = null;
        let minDist = 1e10;
        for(let bodyPoint of this.fish.bodyPoints) {
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
    }

    isDirectedUpwards(points) {
        const contact = {x: (points[0].x + points[points.length-1].x)/2,
                         y: (points[0].y + points[points.length-1].y)/2,};

        const upperX = Math.max(...points.map(p => p.x));
        const lowerX = Math.min(...points.map(p => p.x));
        const upperY = Math.max(...points.map(p => p.y));
        const lowerY = Math.min(...points.map(p => p.y));
        const upperDist = Math.abs(contact.y - upperY);
        const lowerDist = Math.abs(contact.y - lowerY);

        return upperDist > lowerDist;
    }

    findContactPoint(points) {
        const contact = new THREE.Vector3((points[0].x + points[points.length-1].x)/2,
                        (points[0].y + points[points.length-1].y)/2,
                        0);
        
        const camera = this.sceneWrapper.camera;
        const direction = new THREE.Vector3(contact.x - camera.position.x,
            contact.y - camera.position.y, -camera.position.z);
        direction.normalize();
        
        const raycaster = new THREE.Raycaster(camera.position, direction);
        const intersections = raycaster.intersectObjects(this.fish.fishOrigin.children);

        contact.z = intersections[0].point.z;
        return contact;
    }

    findRotation(points, contact) {
        const upperX = Math.max(...points.map(p => p.x));
        const lowerX = Math.min(...points.map(p => p.x));
        const upperY = Math.max(...points.map(p => p.y));
        const lowerY = Math.min(...points.map(p => p.y));

        const upperDist = Math.abs(upperY - contact.y);
        const lowerDist = Math.abs(lowerY - contact.y);
        var isDirectedUpwards = upperDist > lowerDist;

        const width = Math.abs(upperX - lowerX);
        const height = Math.abs(upperY - lowerY);
        var rotationAngle = Math.atan(height / width) - Math.PI/2;
        if(isDirectedUpwards) 
            rotationAngle *= -1;

        return rotationAngle;
    }   
}

