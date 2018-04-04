

WING_AMPLITUDE = 0.5
FIN_AMPLITUDE = 0.2
WING_SPEED = 0.002
FIN_SPEED = 0.01
class Animator {

start(sceneWrapper, fish,bubbles) {
    this.sceneWrapper = sceneWrapper;
    this.fish = fish;
    this.bubbles = bubbles;

    for(let part of this.sceneWrapper.getAllObjects(fish.fishOrigin))
        this.startAnimation(part);

    this.addBubbles();
}

addBubbles() {
    this.bubbles = createBubbleGroup(this.sceneWrapper);
    create_bubbles(this.bubbles);
    for(let bubble of this.sceneWrapper.getAllObjects(this.bubbles))
        this.startBubbles(bubble);
}

startBubbles(bub){
    this.sceneWrapper.animations.push(animateBubbles(bub));
}
startAnimation(part) {
    this.sceneWrapper.animations.push(getVerticalAnimation(part));
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
function getVerticalAnimation(obj){
    var offset = (t) =>(5* Math.sin(0.001*t));
    let intialYPosition = obj.position.y;
    
    if(['body','single-fin'].includes(obj.name))
        return (timestamp) => (obj.position.y = intialYPosition + offset(timestamp));
    else
        return()=>(0);
   
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
        if(obj.position.y>BUBBLE_REGION/2){
            obj.position.y = -BUBBLE_REGION/2;
            obj.position.x = Math.random()*-BUBBLE_REGION+BUBBLE_REGION/2;
        }
        if(obj.position.x>BUBBLE_REGION/2){
            obj.position.x = -BUBBLE_REGION/2;
            obj.position.y = Math.random()*-BUBBLE_REGION+BUBBLE_REGION/2;

        }
        obj.position.y=obj.position.y+offsety(timestamp);
        obj.position.x =obj.position.x + offsetx(timestamp);
    }
    
    if(['bubbles'].includes(obj.name)==false){
        return f ;
    }
    return (timestamp) => (obj.position.x=0);   
}