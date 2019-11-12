class GUI {

    constructor(mainWindow) {
        this.mainWindow = mainWindow;

        // Set defaults
        this.effectController = {
            bloomActive: false,
            bloomSize: 1,
            bloomBlurStrength: 1.0,
            bloomEffectStrength: 0.2,

            sobelActive: false,

            ASCIIActive: false,

            crtActive: false,
            crtLineWidth: 7.0,
            crtRandomValue: 0.0,
            crtRandomShiftValue: 0.0,
            crtRandomShiftWidth: 0.0,
            crtAngular: 2.0,

            glitchActive: false,
            glitchAnimate: false,
            glitchAberration: 1.0,
        };

        // Construct the settings of the GUI
        this.createGUI();
    }

    // Create the GUI with appropriate settings added
    createGUI() {
        let thisInstance = this;

        // Create THREE.js GUI
        this.gui = new dat.GUI();

        // Bloom Effect Controller
        let bloomEffectFolder = this.gui.addFolder("Bloom Effect");

        bloomEffectFolder.add(this.effectController, 'bloomActive').name(
            'Active').onChange(function(flag) {
                thisInstance.mainWindow.activePasses["Bloom Pass"] = !thisInstance.mainWindow.activePasses["Bloom Pass"];
                thisInstance.mainWindow.initComposer();
            });

        let bloomSettingsFolder = bloomEffectFolder.addFolder("Settings");
        bloomSettingsFolder.add(this.effectController, "bloomSize").min(1).max(3).step(1).name(
            "Blur Size").onChange(function() {
                thisInstance.mainWindow.bloomPass.uniforms["blurSize"].value = thisInstance.effectController['bloomSize'];
            });
        bloomSettingsFolder.add(this.effectController, 'bloomEffectStrength', 0.0, 2.0).name(
            'Strength').onChange(function() {
                thisInstance.mainWindow.bloomPass.uniforms["effectStrength"].value = thisInstance.effectController['bloomEffectStrength'];
            });

        // Sobel Effect Controller
        let sobelEffectFolder = this.gui.addFolder("Sobel Effect");

        sobelEffectFolder.add(this.effectController, "sobelActive").name(
            "Active").onChange(function(flag) {
                thisInstance.mainWindow.activePasses["Sobel Pass"] = !thisInstance.mainWindow.activePasses["Sobel Pass"];
                thisInstance.mainWindow.initComposer();
            });

        // ASCII Effect Controller
        let ASCIIEffectFolder = this.gui.addFolder("ASCII Effect");

        ASCIIEffectFolder.add(this.effectController, "ASCIIActive").name(
            "Active").onChange(function(flag) {
                thisInstance.mainWindow.activePasses["ASCII Pass"] = !thisInstance.mainWindow.activePasses["ASCII Pass"];
                thisInstance.mainWindow.initComposer();
            });

        // CRT Effect Controller
        let crtEffectFolder = this.gui.addFolder("CRT Effect");

        crtEffectFolder.add(this.effectController, "crtActive").name(
            "Active").onChange(function(flag) {
                thisInstance.mainWindow.activePasses["CRT Pass"] = !thisInstance.mainWindow.activePasses["CRT Pass"];
                thisInstance.mainWindow.initComposer();
            });

        let crtSettingsFolder = crtEffectFolder.addFolder("Settings");
        crtSettingsFolder.add(this.effectController, 'crtLineWidth', 2.0, 10.0).name(
        'Line Width').onChange(function() {
            thisInstance.mainWindow.crtPass.uniforms["lineWidth"].value = thisInstance.effectController['crtLineWidth'];
        });
        crtSettingsFolder.add(this.effectController, 'crtRandomValue', 0.0, 1000.0).name('Frequency');
        crtSettingsFolder.add(this.effectController, 'crtRandomShiftValue', 0.0, 400.0).name('Max Shift Magnitude');
        crtSettingsFolder.add(this.effectController, 'crtRandomShiftWidth', 0.0, 0.5).name('Max Shift Width');
        crtSettingsFolder.add(this.effectController, 'crtAngular', 1.0, 2.0).name(
            'Angular').onChange(function() {
                thisInstance.mainWindow.crtPass.uniforms['angular'].value = thisInstance.effectController['crtAngular'];
            });

        // Glitch Effect Controller
        let glitchEffectFolder = this.gui.addFolder("Glitch Effect");

        glitchEffectFolder.add(this.effectController, 'glitchActive').name(
            'Active').onChange(function(flag) {
                thisInstance.mainWindow.activePasses["Glitch Pass"] = !thisInstance.mainWindow.activePasses["Glitch Pass"];
                thisInstance.mainWindow.initComposer();
            });

        let glitchSettingsFolder = glitchEffectFolder.addFolder("Settings");
        glitchSettingsFolder.add(this.effectController, "glitchAnimate").name(
            "Animate").onChange(function() {
                thisInstance.mainWindow.glitchPass.uniforms["animate"].value = thisInstance.effectController['glitchAnimate'];
            });
        glitchSettingsFolder.add(this.effectController, 'glitchAberration', 0.0, 100.0).name(
            'Aberration').onChange(function() {
                thisInstance.mainWindow.glitchPass.uniforms["shiftScale"].value = thisInstance.effectController['glitchAberration'];
            });
    }
}