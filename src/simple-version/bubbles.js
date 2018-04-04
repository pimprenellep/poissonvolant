NUMBEROFBUBBLES = 200;
SIZE_BUBBLE = 5;
BUBBLE_REGION = 400;


function createBubbleGroup (sceneWrapper){
	const bubbleOrigin = new THREE.Group();
	bubbleOrigin.name = 'bubbles';
	sceneWrapper.scene.add(bubbleOrigin);
	return bubbleOrigin;
}

function create_bubbles(bubbleOrigin){
	for (var i =0; i<NUMBEROFBUBBLES ; i++) {
		var bubble = generate_bubble();
		bubble.name = "bubble"+i;
		bubble.position.set(Math.random()*(-BUBBLE_REGION)+BUBBLE_REGION/2, Math.random()*(-BUBBLE_REGION)+BUBBLE_REGION/2, Math.random()*(BUBBLE_REGION)-BUBBLE_REGION/2);
		bubbleOrigin.add(bubble);
		
		
	}
}

function generate_bubble(){
	const size = gaussianRand()*SIZE_BUBBLE;
	const bubbleGeometry = new THREE.SphereGeometry(size);
	const bubbleMaterial = new THREE.MeshLambertMaterial( {color:0x608adf, opacity: 0.1, transparent:true} );
	bubbleMaterial.opacity = 0.5;
	const cubeObject = new THREE.Mesh( bubbleGeometry,bubbleMaterial );
	return cubeObject;
}



//trouvé sur internet mais fonctionne pas mal
function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}