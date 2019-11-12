/**
 *   Sobel Shader (Edge Detection)
 */

THREE.SobelShader = {

    uniforms: {
        "tDiffuse": {value: null},
        "resolution": {value: new THREE.Vector2()}
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
        "uniform vec2 resolution;",

        "varying vec2 vUV;",

        "float getAvgAtPixOffset(vec2 offset, vec2 texel) {",

            "vec2 pixLoc = vUV + texel * offset;",
            "if ( pixLoc.x < 0.0 || pixLoc.x > 1.0 || pixLoc.y < 0.0 || pixLoc.y > 1.0)",
                "return 0.0;",
            "vec4 pixColor = texture2D(tDiffuse, pixLoc);",

            "return (pixColor.r + pixColor.g + pixColor.b) / 3.0;",

        "}",

        "float getGx(vec2 texel) {",
        
            "float sum = 0.0;",

            "sum -= getAvgAtPixOffset(vec2(-1.0, -1.0), texel);",
            "sum -= 2.0*getAvgAtPixOffset(vec2(0.0, -1.0), texel);",
            "sum -= getAvgAtPixOffset(vec2(1.0, -1.0), texel);",
            "sum += getAvgAtPixOffset(vec2(-1.0, 1.0), texel);",
            "sum += 2.0*getAvgAtPixOffset(vec2(0.0, 1.0), texel);",
            "sum += getAvgAtPixOffset(vec2(1.0, 1.0), texel);",

            "return sum;",

        "}",

        "float getGy(vec2 texel) {",

            "float sum = 0.0;",

            "sum -= getAvgAtPixOffset(vec2(-1.0, -1.0), texel);",
            "sum -= 2.0*getAvgAtPixOffset(vec2(-1.0, 0.0), texel);",
            "sum -= getAvgAtPixOffset(vec2(-1.0, 1.0), texel);",
            "sum += getAvgAtPixOffset(vec2(1.0, -1.0), texel);",
            "sum += 2.0*getAvgAtPixOffset(vec2(1.0, 0.0), texel);",
            "sum += getAvgAtPixOffset(vec2(1.0, 1.0), texel);",

            "return sum;",
        
        "}",

        "void main() {",

            "vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);",
            
            "float Gx = getGx(texel);",
            "float Gy = getGy(texel);",

            "float mag = sqrt( pow(Gx, 2.0) + pow(Gy, 2.0) );",

            "gl_FragColor = vec4(mag, mag, mag, 1.0);",

        "}"

    ].join("\n")
};