

WING_AMPLITUDE = 0.5
FIN_AMPLITUDE = 0.2
WING_SPEED = 0.002
FIN_SPEED = 0.01
class Animator {

start(sceneWrapper, fish) {
    this.sceneWrapper = sceneWrapper;
    this.fish = fish;
    for(let part of sceneWrapper.getAllObjects(fish.fishOrigin))
        this.startAnimation(part);
}

startAnimation(part) {
    this.sceneWrapper.animations.push(this.getPartAnimation(part));
}

getPartAnimation(part) {
    if(['body', 'pivot', 'single-fin'].includes(part.name))
        return getSinusoidalAnimation(part);
    else if(part.name == 'wing')
        return getRotateAnimation(part, WING_AMPLITUDE, WING_SPEED); 
    else if(part.name == 'fin')
        return getRotateAnimation(part, FIN_AMPLITUDE, FIN_SPEED); 
    else
        return () => (0);
}

};

function getSinusoidalAnimation(obj) {
    var offset = (x, t) => (3 * Math.cos(0.05*x - 0.005*t));
    if(obj.geometry && obj.geometry.vertices) {
        let initialZPositions = obj.geometry.vertices.map(vertex => vertex.z);
        return function(timestamp) {
            for(let [index, vertex] of obj.geometry.vertices.entries()) 
                vertex.z = initialZPositions[index] + offset(vertex.x, timestamp);
            obj.geometry.verticesNeedUpdate = true;
        }
    } else {
        let initialZPosition = obj.position.z;
        return (timestamp) => (obj.position.z = initialZPosition + offset(obj.position.x, timestamp));
    }
}

function getRotateAnimation(part, amplitude, speed) {
    var direction = part.rotation.x > 0 ? 1 : -1 ; 
    var initialRotation = part.rotation.x;
    return (timestamp) => ( part.rotation.x = initialRotation + amplitude * Math.sin(direction * speed * timestamp) );
}