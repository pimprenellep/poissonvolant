
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

	getPivot(position) {
		const pivot = new THREE.Group();
		pivot.name = 'pivot';
		pivot.position.copy(position);
		console.log(pivot.position);
		this.fishOrigin.children[0].add(pivot);
		return pivot;
	}

	getPivotPair(rightPosition) {
		const leftPosition = new THREE.Vector3();
		leftPosition.copy(rightPosition);
		leftPosition.z *= -1;
		return {
			'right' : this.getPivot(rightPosition),
			'left'  : this.getPivot(leftPosition),
		};		
	}

	addPart(partSpecs) {
		this.addPartOfType[partSpecs.type](partSpecs);
	}

	addBody(bodySpecs) {
		this.bodyPoints = bodySpecs.points;
		BodyModeler.addBody(this.fishOrigin, bodySpecs.points);	
	}

	addEyes(eyeSpecs) {
		const pivots = this.getPivotPair(eyeSpecs.center);
		EyesModeler.addEyes(pivots, eyeSpecs);
	}

	addSingleFin(finSpecs) {
		const pivot = this.getPivot(finSpecs.contact);
		FinsModeler.addSingleFin(pivot, finSpecs);
	}
	
	addDoubleFins(finSpecs) {
		const pivots = this.getPivotPair(finSpecs.contact);
		FinsModeler.addDoubleFins(pivots, finSpecs);
	}
	
	addWings(wingSpecs) {
		const pivots = this.getPivotPair(wingSpecs.contact);
		FinsModeler.addWings(pivots, wingSpecs);
	}
}

