

WING_AMPLITUDE = 0.5
FIN_AMPLITUDE = 0.2
WING_SPEED = 0.002
FIN_SPEED = 0.01
class Animator {

start(sceneWrapper, fish,bubbles) {
    this.sceneWrapper = sceneWrapper;
    this.fish = fish;
    this.bubbles = bubbles;
    console.log(sceneWrapper.getAllObjects(bubbles));
    //generateBubbles(frequency,sceneWrapper);
    for(let part of sceneWrapper.getAllObjects(fish.fishOrigin))
        this.startAnimation(part);
    for(let bub of sceneWrapper.getAllObjects(bubbles))
        this.startBubbles(bub);
}

startBubbles(bub){
    this.sceneWrapper.animations.push(animateBubbles(bub));
}
startAnimation(part) {
    //this.sceneWrapper.animations.push(getHorizontalAnimation(part));
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
function getHorizontalAnimation(obj){
    var offset = (t) =>(10* Math.sin(0.001*t));
    let intialYPosition = obj.position.y;
    return (timestamp) => (obj.position.y = intialYPosition + offset(timestamp));
}

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


function animateBubbles(obj){
    var offsety = (t)=> (0.5);
    var offsetx = (t) => (0.5);
    var offset = ( t) => (3 * Math.cos(- 0.005*t));
    const intialYPosition = obj.position.y;
    const initialXPosition = obj.position.x;
    function f(timestamp){
        if(obj.position.y>SCREEN_SIZE/2){
            obj.position.y = -SCREEN_SIZE/2;
            obj.position.x = Math.random()*-SCREEN_SIZE+SCREEN_SIZE/2;
        }
        if(obj.position.x>SCREEN_SIZE/2){
            obj.position.x = -SCREEN_SIZE/2;
            obj.position.y = Math.random()*-SCREEN_SIZE+SCREEN_SIZE/2;

        }
        obj.position.y=obj.position.y+offsety(timestamp);
        obj.position.x =obj.position.x + offsetx(timestamp);
    }
    
    if(['bubbles'].includes(obj.name)==false){
        return f ;
    }
    return (timestamp) => (obj.position.x=0);   
}