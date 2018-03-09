
class Animator {

startAnimation(sceneWrapper, fish) {
    this.fish = fish;
    console.log(sceneWrapper);
    sceneWrapper.animations.push(this.animateBody.bind(this));
}

animateBody(t){
    const body = this.fish.fishOrigin.children[0];
    this.sinusoidalBodyAnimation(body, t);
    for(let child of body.children)
        this.sinusoidalBodyAnimation(child, t);
    
}

sinusoidalBodyAnimation(obj, t) {
    if(obj.geometry && obj.geometry.vertices) {
        for(let vertex of obj.geometry.vertices) 
           vertex.z += 0.2 * Math.cos(0.05* vertex.x - 0.005*t);
        obj.geometry.verticesNeedUpdate = true;
    } else {
        obj.position.z += 0.2 * Math.cos(0.05* obj.position.x - 0.005*t);
    }
}

};