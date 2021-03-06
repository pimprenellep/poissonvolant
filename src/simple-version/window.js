
WindowStates = Object.freeze({'addMode':0, 'adjustMode':1});

class WindowManager {
    constructor() {
        this.sceneWrapper = new SceneWrapper();
        this.fish = new Fish(this.sceneWrapper);
        this.drawingInterpreter = new DrawingInterpreter(this.sceneWrapper, this.fish);
        this.setupMethods();
        Tracer.addAxis(this.sceneWrapper.scene);
        this.setupGui();

        this.actions = [];
        
        this.tracking = false;
        this.state = WindowStates.addMode;
        this.spaceDown = false;

        this.setToggleOnSpace();
    }

    setToggleOnSpace() {
        document.addEventListener('keydown', (event) => {
            if(event.key == ' ') {
                if(!this.spaceDown) {
                    this.spaceDown = true;
                    this.toogleMode(); 
                }
            }
        });
        document.addEventListener('keyup', (event) => { 
            if(event.key == ' ')
                this.spaceDown = false; 
        });
    }

    setupGui() {
        var controls = {
            'Download .obj' : this.exportOBJ,
            'Animate Fish' : this.animateFish,
            'Undo' : this.undoLastAction,
        }
        this.gui = new dat.GUI();
        this.gui.add(controls, 'Download .obj');
        this.gui.add(controls, 'Animate Fish');
        this.gui.add(controls, 'Undo');
    }

    setupMethods() {
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDownOnAddMode = this.onMouseDownOnAddMode.bind(this);
        this.onMouseUpOnAddMode = this.onMouseUpOnAddMode.bind(this);
        this.exportOBJ = this.exportOBJ.bind(this);
        this.undoLastAction = this.undoLastAction.bind(this);
        this.animateFish = this.animateFish.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);

        window.addEventListener('resize', this.onWindowResize);

        this.onMouseDownOnState = {}
        this.onMouseDownOnState[WindowStates.addMode] = this.onMouseDownOnAddMode;
        this.onMouseUpOnState = {}
        this.onMouseUpOnState[WindowStates.addMode] = this.onMouseUpOnAddMode;
    }
    
    onWindowResize() {
    	this.sceneWrapper.camera.aspect = window.innerWidth / window.innerHeight;
		this.sceneWrapper.camera.updateProjectionMatrix();
        this.sceneWrapper.renderer.setSize( window.innerWidth, window.innerHeight );
	}


    exportOBJ() {
        Exporter.exportScene(this.sceneWrapper.scene);
    }

    toogleMode() {
        this.state = 1 - this.state;
    }

    onMouseDown(event) {
        if(this.onMouseDownOnState[this.state])
            this.onMouseDownOnState[this.state](event);
    }

    onMouseUp(event) {
        if(this.onMouseUpOnState[this.state])
            this.onMouseUpOnState[this.state](event);
    }

    onMouseDownOnAddMode(event) {
        Tracer.startTracking(this.sceneWrapper);
        this.tracking = true;
    }

    onMouseUpOnAddMode(event) {
        if(!this.tracking)
            return;
        this.tracking = false;

        Tracer.stopTracking();
        const drawingPoints = Tracer.getTrace();
        Tracer.removeTrace();
        if(seemsToBeMisclick(drawingPoints))
            return;

        const smoothedPoints = smoothPoints(drawingPoints);
        const fishPartSpecification = this.drawingInterpreter.interpret(smoothedPoints);
        this.addToFish(fishPartSpecification);
    }

    addToFish(fishPartSpecification) {
        const action = new Action();
        action.objsBefore(this.sceneWrapper.getAllObjects()); 
        this.fish.addPart(fishPartSpecification);
        action.objsAfter(this.sceneWrapper.getAllObjects());
        this.actions.push(action);
    }

    undoLastAction() {
        if(this.actions.length == 0)
            return;

        const lastAction = this.actions.pop();
        lastAction.undo();
    }

    animateFish() {
        if(this.state != WindowStates.adjustMode)
            this.toogleMode();
        this.animator = new Animator();
        this.animator.start(this.sceneWrapper, this.fish);
        Tracer.removeAxis();
    }
}

function seemsToBeMisclick(points) {
    var distanceThreshold = 2;
    var numPointsThreshold = 5; 
    return points.length <= numPointsThreshold || totalDistance(points) <= distanceThreshold;
}

function totalDistance(points) {
    var dist = (p, q) => (Math.sqrt((p.x - q.x)**2 + (p.y - q.y)**2));
    var distance = 0;
    for(let i = 0; i != points.length; ++i) {
        j = (i + 1) % points.length;
        distance += dist(points[i], points[j]); 
    }
    return distance;
}

function smoothPoints(points) {
    var curve = new THREE.SplineCurve(points);
    const numPoints = Math.floor(getTraceLength(points)/3);
    return curve.getSpacedPoints(numPoints);
}

function getTraceLength(points) {
    const dist = (p, q) => Math.sqrt((p.x - q.x)**2 + (p.y - q.y)**2);
    var traceLength = 0;
    for(let i = 0; i != points.length - 1; ++i)
        traceLength += dist(points[i], points[i+1]);
    return traceLength;
}

var windowManager;

window.onload = () => { windowManager = new WindowManager(); }

