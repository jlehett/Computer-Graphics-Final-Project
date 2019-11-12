/**
 *   CRT Shader (Old TV / Computer)
 */

THREE.CRTShader = {

    uniforms: {
        "tDiffuse": {value: null},
        "resolution": {value: new THREE.Vector2()},
        "lineWidth": {value: 7.0},
        "randomValue": {value: 0.0},
        "randomShiftValue": {value: 0.0},
        "randomShiftWidth": {value: 0.0},
        "angular": {value: 2.0},
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
        "uniform float lineWidth;",
        "uniform float randomValue;",
        "uniform float randomShiftValue;",
        "uniform float randomShiftWidth;",
        "uniform float angular;",

        "varying vec2 vUV;",

        "vec4 getColorAtPixOffset(vec2 offset, vec2 texel) {",

            "vec2 pixLoc = vUV + texel * offset;",
            "if ( pixLoc.x < 0.0 || pixLoc.x > 1.0 || pixLoc.y < 0.0 || pixLoc.y > 1.0)",
                "return texture2D(tDiffuse, vUV);",
            "vec4 pixColor = texture2D(tDiffuse, pixLoc);",

            "return pixColor;",

        "}",

        "float blurGreen(vec2 texel, vec2 centerPix) {",

            "float greenSum = 0.0;",
            "float dividend = 0.0;",
            "for (int x = -7; x <= 12; x++) {",
                "float greenColor = getColorAtPixOffset(vec2(x + int(centerPix.x), 0.0), texel).g;",
                "greenSum += greenColor;",
                "dividend += 1.0;",
            "}",

            "return greenSum / dividend;",

        "}",

        "float blurRed(vec2 texel, vec2 centerPix) {",

            "float redSum = 0.0;",
            "float dividend = 0.0;",
            "for (int x = 0; x <= 5; x++) {",
                "float redColor = getColorAtPixOffset(vec2(x + int(centerPix.x), 0.0), texel).r;",
                "redSum += redColor;",
                "dividend += 1.0;",
            "}",

            "return redSum / dividend;",

        "}",

        "float getOpacity() {",

            "float modu = mod(vUV.y * resolution.y, lineWidth);",
            "float scaledMod = modu / lineWidth;",
            "if (scaledMod <= 0.5) {",
                "return mix(0.0, 1.0, scaledMod * 2.0);",
            "}",
            "scaledMod -= 0.5;",
            "return mix(1.0, 0.0, scaledMod * 2.0);",

            "return mod(vUV.y * resolution.y, 4.0) / pow(2.0, mod(vUV.y * resolution.y, 2.0));",

        "}",

        "void main() {",

            "vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);",
            
            "vec2 centerPix = vec2(0.0, 0.0);",

            "float flag = mod(vUV.y * resolution.y, randomValue) / randomValue;",
            "if (flag > 0.5 - randomShiftWidth / 2.0 && flag < 0.5 + randomShiftWidth / 2.0) {",
                "float reCentered = flag - (0.5 - randomShiftWidth / 2.0);",
                "float xShift;",
                "if (reCentered < randomShiftWidth / 2.0) xShift = mix(0.0, randomShiftValue, pow(reCentered, angular) / randomShiftWidth);",
                "else xShift = mix(randomShiftValue, 0.0, pow(reCentered, angular) / randomShiftWidth);",
                "centerPix = vec2(xShift, 0.0);",
            "}",

            "vec4 pixColor = getColorAtPixOffset(centerPix, texel);",
            "float blurredGreen = blurGreen(texel, centerPix);",
            "float blurredRed = blurRed(texel, centerPix);",

            "vec4 baseColor = vec4(max(blurredRed, pixColor.r) * 0.85, max(blurredGreen, pixColor.g), pixColor.b * 0.85, 1.0);",

            "float opacity = getOpacity();",

            "gl_FragColor = vec4(baseColor.r * opacity, baseColor.g * opacity, baseColor.b * opacity, 1.0);",

        "}"

    ].join("\n")
};