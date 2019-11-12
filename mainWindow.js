
class MainWindow {

    constructor() {
        // Set width and height according to window size
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        // Passes Active Map
        this.activePasses = {
            "Glitch Pass": false,
            "Sobel Pass": false,
            "ASCII Pass": false,
            "Bloom Pass": false,
            "CRT Pass": false,
        };

        // Initialize the MainWindow
        this.init();
        // Render the initial scene
        this.render();
    }

    render() {
        let thisInstance = this;

        setTimeout( function() {
            requestAnimationFrame(thisInstance.render.bind(thisInstance));
        }, 1000 / 60);
        // Render with composer pipeline
        this.composer.render();
    }

    // Set the GUI
    setGUI(gui) {
        this.gui = gui;
    }

    // Initialize MainWindow and all components required for the project
    init() {
        // Initialize the renderer pipeline
        this.initRenderer();
        // Initialize the scene
        this.initScene();
        // Initialize Post-Processing Effects Composer
        this.initComposer();
        // Event Handlers
        this.setupEventHandlers();
        // Set Shader Update Threads
        this.setShaderUpdateThread();
    }

    initComposer() {
        // Create Post-Processing Effects Composer
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        // Sobel Pass
        this.sobelPass = new THREE.ShaderPass(THREE.SobelShader);
        this.sobelPass.uniforms["resolution"].value.x = this.WIDTH * window.devicePixelRatio;
        this.sobelPass.uniforms["resolution"].value.y = this.HEIGHT * window.devicePixelRatio;
        if (this.activePasses["Sobel Pass"] == true) {
            this.composer.addPass(this.sobelPass);
        }
        // ASCII Pass
        this.ASCIIPass = new THREE.ShaderPass(THREE.ASCIIShader);
        this.ASCIIPass.uniforms["resolution"].value.x = this.WIDTH * window.devicePixelRatio;
        this.ASCIIPass.uniforms["resolution"].value.y = this.HEIGHT * window.devicePixelRatio;
        if (this.activePasses["ASCII Pass"] == true) {
            this.composer.addPass(this.ASCIIPass);
        }
        // Glitch Pass
        this.glitchPass = new THREE.ShaderPass(THREE.GlitchShader);
        this.glitchPass.uniforms["resolution"].value.x = this.WIDTH * window.devicePixelRatio;
        this.glitchPass.uniforms["resolution"].value.y = this.HEIGHT * window.devicePixelRatio;
        if (this.gui) {
            this.glitchPass.uniforms["shiftScale"].value = this.gui.effectController["glitchAberration"];
            this.glitchPass.uniforms["animate"].value = this.gui.effectController["glitchAnimate"];
        }
        if (this.activePasses["Glitch Pass"] == true) {
            this.composer.addPass(this.glitchPass);
        }
        // Bloom Pass
        this.bloomPass = new THREE.ShaderPass(THREE.BloomShader);
        this.bloomPass.uniforms["resolution"].value.x = this.WIDTH * window.devicePixelRatio;
        this.bloomPass.uniforms["resolution"].value.y = this.HEIGHT * window.devicePixelRatio;
        if (this.gui) {
            this.bloomPass.uniforms["blurSize"].value = this.gui.effectController["bloomSize"];
            this.bloomPass.uniforms["effectStrength"].value = this.gui.effectController["bloomEffectStrength"];
        }
        if (this.activePasses["Bloom Pass"] == true) {
            this.composer.addPass(this.bloomPass);
        }
        // CRT Pass
        this.crtPass = new THREE.ShaderPass(THREE.CRTShader);
        this.crtPass.uniforms["resolution"].value.x = this.WIDTH * window.devicePixelRatio;
        this.crtPass.uniforms["resolution"].value.y = this.HEIGHT * window.devicePixelRatio;
        if (this.gui) {
            this.crtPass.uniforms["randomValue"].value = this.gui.effectController["crtRandomValue"];
            this.crtPass.uniforms["randomShiftValue"].value = this.gui.effectController["crtRandomShiftValue"];
            this.crtPass.uniforms["randomShiftWidth"].value = this.gui.effectController["crtRandomShiftWidth"];
            this.crtPass.uniforms["angular"].value = this.gui.effectController["crtAngular"];
        }
        if (this.activePasses["CRT Pass"] == true) {
            this.composer.addPass(this.crtPass);
        }
    }

    setShaderUpdateThread() {
        let thisInstance = this;
        // Update Glitch Uniforms
        setInterval( function() {
            thisInstance.glitchPass.uniforms["randomValue"].value = Math.random() * thisInstance.gui.effectController["glitchAberration"];
        }, 1000 / 10);
        // Update CRT Uniforms
        setInterval( function() {
            thisInstance.crtPass.uniforms["randomValue"].value = Math.random() * thisInstance.gui.effectController['crtRandomValue'] + 200;
            thisInstance.crtPass.uniforms["randomShiftValue"].value = Math.random() * thisInstance.gui.effectController['crtRandomShiftValue'] - thisInstance.gui.effectController['crtRandomShiftValue'] / 2.0
            thisInstance.crtPass.uniforms["randomShiftWidth"].value = Math.random() * thisInstance.gui.effectController['crtRandomShiftWidth'];
        }, 1000 / 4.0);
    }

    initRenderer() {
        // Create basic WebGLRenderer
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.setClearColor(0x000000, 1);
        document.body.appendChild(this.renderer.domElement);
    }

    initScene() {
        this.scene = new THREE.Scene();
        // Initialize the Camera
        this.initCamera();
        // Initialize Panoramic Background
        this.initBackground();
        // Initialize Teapot geometry
        this.initGeometry();
        // Initialize the scene lights
        this.initLights();
    }

    initBackground() {
        // Create the panoramic background with pano.jpg texture
        let texture = new THREE.TextureLoader().load('pano.jpg');

        let geometry = new THREE.SphereBufferGeometry(150, 60, 40);
        geometry.scale(-1, 1, 1);
        let material = new THREE.MeshBasicMaterial({map: texture});

        let mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    initCamera() {
        // Basic Orbit-control enabled perspective camera
        this.camera = new THREE.PerspectiveCamera(5, this.WIDTH / this.HEIGHT, 0.1, 1000000);
        this.camera.position.set(0, 3.5*15, 70*15);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    }

    initGeometry() {
        // Create the basic teapot mesh and drop it into the scene at position (0, 0, 0)
        let teapotGeometry = new THREE.TeapotBufferGeometry(5);
        let teapotMaterial = new THREE.MeshLambertMaterial({
            color: 0xaaffaa
        });
        let teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial);
        this.scene.add(teapotMesh);
        // Create the basic torus knot geometry mesh and drop it into the scene
        let knotGeometry = new THREE.TorusKnotGeometry(10/2, 3/2, 1000, 16);
        let knotMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaff
        });
        let knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
        knotMesh.position.set(20.0, 0.0, 0.0);
        this.scene.add(knotMesh);
        // Create the basic sphere geometry mesh and drop it into the scene
        let sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
        let sphereMaterial = new THREE.MeshPhongMaterial({
            color:0xffaaaa,
            shininess: 200.0,
        });
        let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.position.set(-20.0, 0.0, 0.0);
        this.scene.add(sphereMesh);
    }

    initLights() {
        // Initialize basic lighting in the scene
        let dirLight = new THREE.DirectionalLight(
            0xffffff, 0.5
        );
        this.scene.add(dirLight);
        let ambLight = new THREE.AmbientLight(
            0x404040
        );
        this.scene.add(ambLight);
    }

    setupEventHandlers() {
        this.handleWindowResize();
        this.handleCameraChange();
    }

    handleWindowResize() {
        // Handle window resizes by resizing THREE.js window as well
        let thisInstance = this;
        window.addEventListener(
            "resize",
            function() {
                thisInstance.WIDTH = window.innerWidth;
                thisInstance.HEIGHT = window.innerHeight;
                thisInstance.renderer.setSize(thisInstance.WIDTH, thisInstance.HEIGHT);
                thisInstance.camera.aspect = thisInstance.WIDTH / thisInstance.HEIGHT;
                thisInstance.camera.updateProjectionMatrix();
                thisInstance.initComposer();
            }
        );
    }

    handleCameraChange() {
        // Handle changes in the camera that require a new rendering
        let thisInstance = this;
        this.cameraControls.addEventListener("change", function() {
            thisInstance.camera.updateProjectionMatrix();
        });
    }
}