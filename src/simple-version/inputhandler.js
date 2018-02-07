
const Input = {
	isPressed: {},
	keyCommand: {},
	mouse: new THREE.Vector2(),

	handle: function() {
		for(key in this.keyCommand)
			if(this.isPressed[key])
				this.keyCommand[key]();
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

document.onkeydown = document.onkeyup = function (event) {
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

