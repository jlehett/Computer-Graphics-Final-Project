/**
 *   Glitch Shader (RGB Channel Shifting)
 */

THREE.GlitchShader = {

    uniforms: {
        "tDiffuse": {value: null},
        "shiftScale": {value: 1.0},
        "resolution": {value: new THREE.Vector2()},
        "animate": {value: false},
        "randomValue": {value: 0.0}
    },

    vertexShader: [

        "precision highp float;",
        "precision highp int;",
        
        "varying vec2 vUV;",
        
        "void main() {",

            "vUV = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",

        "}"

    ].join("\n"),

    fragmentShader: [

        "uniform sampler2D tDiffuse;",
        "uniform float shiftScale;",
        "uniform vec2 resolution;",
        "uniform bool animate;",
        "uniform float randomValue;",

        "varying vec2 vUV;",

        "void main() {",

            "vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);",
            
            "float shift = shiftScale;",

            "if (animate) {",
                "shift = randomValue;",
            "}",

            "float red = texture2D(tDiffuse, vUV + texel * vec2(0.0, 0.0) * shift).r;",
            "float green = texture2D(tDiffuse, vUV + texel * vec2(1.0, 1.0) * shift).g;",
            "float blue = texture2D(tDiffuse, vUV + texel * vec2(-1.0, 1.0) * shift).b;",

            "gl_FragColor = vec4(red, green, blue, 1.0);",

        "}"

    ].join("\n")
};