
WindowStates = Object.freeze({'addMode':0, 'adjustMode':1});

class WindowManager {
    constructor() {
        this.sceneWrapper = new SceneWrapper();
        this.fish = new Fish(this.sceneWrapper);
        this.drawingInterpreter = new DrawingInterpreter(this.sceneWrapper, this.fish);
        this.setupMethods();
        Tracer.addAxis(this.sceneWrapper.scene);
        this.setupGui();
        
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
            'exportOBJ' : this.exportOBJ,
            'animateFish' : this.animateFish,
        }
        this.gui = new dat.GUI();
        this.gui.add(controls, 'exportOBJ');
        this.gui.add(controls, 'animateFish');
    }

    setupMethods() {
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDownOnAddMode = this.onMouseDownOnAddMode.bind(this);
        this.onMouseUpOnAddMode = this.onMouseUpOnAddMode.bind(this);
        this.exportOBJ = this.exportOBJ.bind(this);
        this.animateFish = this.animateFish.bind(this);

        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);

        this.onMouseDownOnState = {}
        this.onMouseDownOnState[WindowStates.addMode] = this.onMouseDownOnAddMode;
        this.onMouseUpOnState = {}
        this.onMouseUpOnState[WindowStates.addMode] = this.onMouseUpOnAddMode;
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
        this.fish.addPart(fishPartSpecification);
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
    return curve.getSpacedPoints(30);
}

var windowManager;

window.onload = () => { windowManager = new WindowManager(); }

