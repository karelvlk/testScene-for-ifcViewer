
export default class AppScene extends THREE.EventDispatcher {
    constructor() {
        super()
        this.scene = null
        this.container = null
        this.renderer = null
        this.camera = null

        this.buildScene()
    }

    buildScene() {
        this.scene = new THREE.Scene();
        this.createRenderers()
        this.createCamera()
        this.controls = new THREE.OrbitControls( this.getCamera(), this.getRenderer().domElement );
        this.controls.enabled = false
        this.createLights()
        this.createAxes()
        this.createGridHelper()
        console.log('THIS.', this)
        this.animationLoop()
    }

    setOrbitEnabled() {
        this.controls.enabled = true
    }

    setOrbitDisabled() {
        this.controls.enabled = false
    }

    createAxes() {
        let axes = new THREE.AxesHelper(5)
        this.getScene().add(axes)
    }

    createGridHelper() {
        let gridHelper = new THREE.GridHelper( 20, 20 );
        gridHelper.position.set(0,-1,0)
        this.addToScene( gridHelper );
    }


    createLights() {
        const directionalLight1 = new THREE.DirectionalLight(0xffeeff, 0.8);
        directionalLight1.position.set(1, 1, 1);
        this.scene.add(directionalLight1);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-1, 0.5, -1);
        this.scene.add(directionalLight2);
        const ambientLight = new THREE.AmbientLight(0xffffee, 0.25);
        this.scene.add(ambientLight);
    }

    createCamera() {
        let width = document.getElementById('three-canvas').clientWidth
        let height = document.getElementById('three-canvas').clientHeight
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);
        this.camera.aspect = width / height;
        this.camera.lookAt(new THREE.Vector3(1, 5, 0));
        this.camera.position.set(-10, 10, 0)
    }

    createRenderer3D() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this.renderer.setClearColor(new THREE.Color(0x303234), 1)
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.localClippingEnabled = true;

        this.container.appendChild(this.renderer.domElement)
    }

    createRenderers() {
        this.container = document.getElementById('three-canvas')
        this.container.style.width = window.innerWidth
        this.createRenderer3D()
    }

    setCameraAspectRatio() {
        let width = document.getElementById('three-canvas').clientWidth
        let height = document.getElementById('three-canvas').clientHeight
        this.renderer.setSize(width, height)
        this.renderer2D.setSize(width, height)
        this.camera.aspect = width/height
        this.camera.updateProjectionMatrix()
    }

    getRenderer() {
        return this.renderer
    }

    getCamera() {
        return this.camera
    }

    getScene() {
        return this.scene
    }

    addToScene(element) {
        this.scene.add(element)
    }

    animationLoop() {
        requestAnimationFrame(this.animationLoop.bind(this));
        this.getRenderer().clear();
        this.getRenderer().clearDepth();
        this.getRenderer().render(this.getScene(), this.getCamera());
        //this.controls.update();
    }
}