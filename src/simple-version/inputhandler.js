
const Input = {
	isPressed: {},
	keyCommand: {},
	mouse: new THREE.Vector2(),

	handle: function() {
		for(let key in this.keyCommand){
			if(this.isPressed[key])
				this.keyCommand[key]();
		}
	},

	getMouse3DCoordinates: function(camera) {
		const point = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
		point.unproject(camera);
		point.sub(camera.position);
		point.multiplyScalar(-camera.position.z/point.z);
		point.add(camera.position);
		return point;
	},

};

document.addEventListener('keydown', onKeyEvent);
document.addEventListener('keyup', onKeyEvent);
function onKeyEvent(event) {
    Input.isPressed[event.key] = event.type == 'keydown';
};

function onMouseDown(event) {
	Input.isPressed['mouseLeftButton'] = true;
}
document.addEventListener('mousedown', onMouseDown);

function onMouseUp(event) {
	Input.isPressed['mouseLeftButton'] = false;
}
document.addEventListener('mouseup', onMouseUp);

function updateMousePosition(event) {
	Input.mouse.x = 2*(event.clientX/window.innerWidth) - 1
	Input.mouse.y = (-1) * (2*(event.clientY/window.innerHeight) - 1);
}

document.addEventListener('mousemove', updateMousePosition);


function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        default:           return;
	}
	
	if(event.type == "touchstart") {
		Input.mouse.x = 2*(first.clientX/window.innerWidth) - 1;
		Input.mouse.y = (-1) * (2*(first.clientY/window.innerHeight) - 1);
	}


    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);

	if(event.type == "touchend") {
		event.target.click();
	}

    event.preventDefault();
}

function initTouch() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
}

initTouch();