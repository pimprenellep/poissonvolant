"use strnct";

const corpsPoisson = (function(){
	return{
		Corps : function(){
			var path = traceLigne();
			var tete = traceTete();
			var radius = tete.radius;
			var tube = new THREE.TubeBufferGeometry(path, 64, radius, 8, closed);
			return tube;
		}
	}
})



function traceLigne(){
	return new THREE.LineCurve( new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0) );
}

function traceTete(){
	return new THREE.SphereBufferGeometry(1, 32,32);
}
