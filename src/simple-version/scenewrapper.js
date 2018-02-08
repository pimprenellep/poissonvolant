
class SceneWrapper {
	constructor() {
		this.initCamera();
		this.initRenderer();
		this.initScene();
		this.animations = [];
		this.animate();
	}

	initCamera() {
		const angle = 60;
		const ratio = window.innerWidth/window.innerHeight;
		const nearClippingDist = 1;
		const farClippingDist = 2000;
		this.camera = new THREE.PerspectiveCamera(angle, ratio, nearClippingDist, farClippingDist);
		this.camera.position.z = 100;
		this.camera.lookAt(new THREE.Vector3(0,0,0));
	}

	initRenderer() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	}

	initScene() {
		this.scene = new THREE.Scene();
		this.orbitControls = new THREE.OrbitControls(this.camera);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		for(let animation of this.animations)
			animation();
		this.render();
	}
}