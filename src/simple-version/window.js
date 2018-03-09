
WindowStates = Object.freeze({'addMode':0, 'adjustMode':1});

class WindowManager {
    constructor() {
        this.sceneWrapper = new SceneWrapper();
        this.fish = new Fish(this.sceneWrapper);
        this.drawingInterpreter = new DrawingInterpreter(this.sceneWrapper, this.fish);
        this.setupMethods();
        
        this.state = WindowStates.addMode;
        this.tracking = false;

        Tracer.addAxis(this.sceneWrapper.scene);

        document.addEventListener('keydown', (event) => { if(event.key == ' ') this.toogleMode(); })
        // Input.keyCommand[' '] = this.toogleMode.bind(this);
    }

    setupMethods() {
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDownOnAddMode = this.onMouseDownOnAddMode.bind(this);
        this.onMouseUpOnAddMode = this.onMouseUpOnAddMode.bind(this);

        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);

        this.onMouseDownOnState = {}
        this.onMouseDownOnState[WindowStates.addMode] = this.onMouseDownOnAddMode;
        this.onMouseUpOnState = {}
        this.onMouseUpOnState[WindowStates.addMode] = this.onMouseUpOnAddMode;
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

        const fishPartSpecification = this.drawingInterpreter.interpret(drawingPoints);
        this.fish.addPart(fishPartSpecification);
    }
}


var windowManager;

window.onload = () => { windowManager = new WindowManager(); }

