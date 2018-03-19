
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
        console.log(this.sceneWrapper.getAllObjects(this.fish.fishOrigin));
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

        const fishPartSpecification = this.drawingInterpreter.interpret(drawingPoints);
        this.fish.addPart(fishPartSpecification);
    }

    animateFish() {
        this.animator = new Animator();
        this.animator.start(this.sceneWrapper, this.fish);
    }
}


var windowManager;

window.onload = () => { windowManager = new WindowManager(); }

