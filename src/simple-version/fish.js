
class Fish {
	constructor(sceneWrapper) {
		this.sceneWrapper = sceneWrapper;
		this.fishOrigin = new THREE.Group();
		this.fishOrigin.name = 'fish';
		this.sceneWrapper.scene.add(this.fishOrigin);

		this.setupMethods();
	}

	setupMethods() {
		this.addBody = this.addBody.bind(this);
		this.addEyes = this.addEyes.bind(this);
		this.addSingleFin = this.addSingleFin.bind(this);
		this.addDoubleFins = this.addDoubleFins.bind(this);
		this.addWings = this.addWings.bind(this);

		
		this.addPartOfType = {
			'body' : this.addBody,
			'eye' : this.addEyes,
			'single-fin' : this.addSingleFin,
			'double-fins' : this.addDoubleFins,
			'wings' : this.addWings,
		}
	}

	addPart(partSpecs) {
		this.addPartOfType[partSpecs.type](partSpecs);
	}

	addBody(bodySpecs) {
		this.bodyPoints = bodySpecs.points;
		BodyModeler.addBody(this.fishOrigin, bodySpecs.points);	
	}

	addEyes(eyeSpecs) {
		EyesModeler.addEyes(this.fishOrigin, eyeSpecs);
	}

	addSingleFin(finSpecs) {
		FinsModeler.addSingleFin(this.fishOrigin, finSpecs);
	}
	
	addDoubleFins(finSpecs) {
		FinsModeler.addDoubleFins(this.fishOrigin, finSpecs);
	}
	
	addWings(wingSpecs) {
		FinsModeler.addWings(this.fishOrigin, wingSpecs);
	}
}

