/**
 *   Dither Shader
 */

THREE.DitherShader = {

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

        "vec2 getXYCoords() {",
        
            "return vec2(vUV.x * resolution.x, vUV.y * resolution.y);",

        "}",

        "float getColorScaled(float pixColor, float scale) {",

            "return floor(pixColor * scale);",

        "}",

        "float getDitherValue(vec2 texel) {",

            "float bwValue = getAvgAtPixOffset(vec2(0.0, 0.0), texel);",
            "float scaled = getColorScaled(bwValue, 16.0);",
            
            "vec2 coords = getXYCoords();",
            "int modX = int(coords.x) % 4;",
            "int modY = int(coords.y) % 4;",

            "float scaledToBeat = 16.0;",

            "if (modX == 0 && modY == 0) scaledToBeat = 1.0;",
            "if (modX == 1 && modY == 0) scaledToBeat = 9.0;",
            "if (modX == 2 && modY == 0) scaledToBeat = 3.0;",
            "if (modX == 3 && modY == 0) scaledToBeat = 11.0;",
            "if (modX == 0 && modY == 1) scaledToBeat = 13.0;",
            "if (modX == 1 && modY == 1) scaledToBeat = 5.0;",
            "if (modX == 2 && modY == 1) scaledToBeat = 15.0;",
            "if (modX == 3 && modY == 1) scaledToBeat = 7.0;",
            "if (modX == 0 && modY == 2) scaledToBeat = 4.0;",
            "if (modX == 1 && modY == 2) scaledToBeat = 12.0;",
            "if (modX == 2 && modY == 2) scaledToBeat = 2.0;",
            "if (modX == 3 && modY == 2) scaledToBeat = 10.0;",
            "if (modX == 0 && modY == 3) scaledToBeat = 16.0;",
            "if (modX == 1 && modY == 3) scaledToBeat = 8.0;",
            "if (modX == 2 && modY == 3) scaledToBeat = 14.0;",
            "if (modX == 3 && modY == 3) scaledToBeat = 6.0;",

            "if (scaled < scaledToBeat) return 0.0;",
            "else return 1.0;",

        "}",

        "void main() {",

            "vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);",

            "float value = getDitherValue(texel);",

            "gl_FragColor = vec4(value, value, value, 1.0);",

        "}"

    ].join("\n")
};