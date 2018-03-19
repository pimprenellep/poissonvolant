

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
    if(part.name == 'body' || part.name == 'pivot')
        return (timestamp) => (sinusoidalAnimation(part, timestamp));
    else if(part.name == 'wing')
        return getRotateAnimation(part, WING_AMPLITUDE, WING_SPEED); 
    else if(part.name == 'fin')
        return getRotateAnimation(part, FIN_AMPLITUDE, FIN_SPEED); 
    else
        return () => (0);
}

};

function sinusoidalAnimation(obj, timestamp) {
    if(obj.geometry && obj.geometry.vertices) {
        for(let vertex of obj.geometry.vertices) 
           vertex.z += 0.2 * Math.cos(0.05* vertex.x - 0.005*timestamp);
        obj.geometry.verticesNeedUpdate = true;
    } else {
        obj.position.z += 0.2 * Math.cos(0.05* obj.position.x - 0.005*timestamp);
    }
}

function getRotateAnimation(part, amplitude, speed) {
    var direction = part.rotation.x > 0 ? 1 : -1 ; 
    var initialRotation = part.rotation.x;
    return (timestamp) => ( part.rotation.x = initialRotation + amplitude * Math.sin(direction * speed * timestamp) );
}