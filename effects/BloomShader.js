/**
 *   Bloom Shader
 */

THREE.BloomShader = {

    uniforms: {
        "tDiffuse": {value: null},
        "resolution": {value: new THREE.Vector2()},
        "blurSize": {value: 1},
        "effectStrength": {value: 0.2}
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
        "uniform int blurSize;",
        "uniform float effectStrength;",

        "varying vec2 vUV;",

        "vec4 getColorAtPixOffset(vec2 offset, vec2 texel) {",

            "vec2 pixLoc = vUV + texel * offset;",
            "if ( pixLoc.x < 0.0 || pixLoc.x > 1.0 || pixLoc.y < 0.0 || pixLoc.y > 1.0)",
                "return texture2D(tDiffuse, vUV);",
            "vec4 pixColor = texture2D(tDiffuse, pixLoc);",

            "return pixColor;",

        "}",

        "vec4 blur5() {",

            "vec4 color = vec4(0.0);",
            "vec2 off1 = vec2(1.3333333333333333);",
            "color += texture2D(tDiffuse, vUV) * 0.29411764705882354;",
            "color += texture2D(tDiffuse, vUV + (off1 / resolution)) * 0.35294117647058826;",
            "color += texture2D(tDiffuse, vUV - (off1 / resolution)) * 0.35294117647058826;",
            "return color;",

        "}",

        "vec4 blur9() {",

            "vec4 color = vec4(0.0);",
            "vec2 off1 = vec2(1.3846153846);",
            "vec2 off2 = vec2(3.2307692308);",
            "color += texture2D(tDiffuse, vUV) * 0.2270270270;",
            "color += texture2D(tDiffuse, vUV + (off1 / resolution)) * 0.3162162162;",
            "color += texture2D(tDiffuse, vUV - (off1 / resolution)) * 0.3162162162;",
            "color += texture2D(tDiffuse, vUV + (off2 / resolution)) * 0.0702702703;",
            "color += texture2D(tDiffuse, vUV - (off2 / resolution)) * 0.0702702703;",
            "return color;",

        "}",

        "vec4 blur13() {",

            "vec4 color = vec4(0.0);",
            "vec2 off1 = vec2(1.411764705882353);",
            "vec2 off2 = vec2(3.2941176470588234);",
            "vec2 off3 = vec2(5.176470588235294);",
            "color += texture2D(tDiffuse, vUV) * 0.1964825501511404;",
            "color += texture2D(tDiffuse, vUV + (off1 / resolution)) * 0.2969069646728344;",
            "color += texture2D(tDiffuse, vUV - (off1 / resolution)) * 0.2969069646728344;",
            "color += texture2D(tDiffuse, vUV + (off2 / resolution)) * 0.09447039785044732;",
            "color += texture2D(tDiffuse, vUV - (off2 / resolution)) * 0.09447039785044732;",
            "color += texture2D(tDiffuse, vUV + (off3 / resolution)) * 0.010381362401148057;",
            "color += texture2D(tDiffuse, vUV - (off3 / resolution)) * 0.010381362401148057;",
            "return color;",

        "}",

        "void main() {",

            "vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);",

            "vec4 blurAvg = vec4(0.0, 0.0, 0.0, 0.0);",
            "if (blurSize == 1) blurAvg = blur5();",
            "else if (blurSize == 2) blurAvg = blur9();",
            "else blurAvg = blur13();",

            "vec4 color = getColorAtPixOffset(vec2(0.0, 0.0), texel) + blurAvg*effectStrength;",
            "color = vec4(min(color.r, 1.0), min(color.g, 1.0), min(color.b, 1.0), 1.0);",

            "gl_FragColor = color;",

        "}"

    ].join("\n")
};