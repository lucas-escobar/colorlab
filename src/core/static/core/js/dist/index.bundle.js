/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/static/core/js/renderer.js":
/*!*********************************************!*\
  !*** ./src/core/static/core/js/renderer.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var simplex_noise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! simplex-noise */ \"./node_modules/simplex-noise/dist/esm/simplex-noise.js\");\n\r\n\r\nclass CanvasNotFoundError extends Error {\r\n  constructor(msg) {\r\n    super(msg);\r\n    this.name = \"CanvasNotFoundError\";\r\n  }\r\n}\r\nconst targetElementId = \"webglcanvas\";\r\nconst canvas = document.getElementById(targetElementId);\r\n\r\nif (!canvas) {\r\n  throw new CanvasNotFoundError(\r\n    `Canvas element with id=${targetElementId} was not found in html doc!`\r\n  );\r\n}\r\n\r\nconst gl = canvas.getContext(\"webgl\");\r\n\r\nconst vertices = new Float32Array([\r\n  -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,\r\n]);\r\n\r\nconst indices = new Uint16Array([0, 1, 2, 2, 3, 0]);\r\n\r\nconst vertexShaderSource = `\r\n  attribute vec2 aPosition;\r\n  void main() {\r\n    gl_Position = vec4(aPosition, 0.0, 1.0);\r\n  }\r\n`;\r\n\r\nconst fragmentShaderSource = `\r\nprecision mediump float;\r\n\r\nuniform vec2 uResolution;\r\nuniform vec2 uNoiseTexResolution;\r\nuniform float uTime;\r\nuniform sampler2D uNoiseTex;\r\n\r\nfloat sdHexagon(in vec2 p, in float r) {\r\n  const vec3 k = vec3(-0.866025404,0.5,0.577350269);\r\n  p = abs(p);\r\n  p -= 2.0*min(dot(k.xy, p), 0.0)*k.xy;\r\n  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);\r\n  return length(p)*sign(p.y);\r\n}\r\n\r\nfloat repeat(in vec2 p, in float r, in float s, in vec2 lima, in vec2 limb, in vec2 numShapes, out vec2 id) {\r\n  //id = clamp(floor(p/s + 0.5), lima, limb);\r\n  id = floor(p/s + 0.5);\r\n  vec2 o = sign(p-s*id);\r\n\r\n  float d = 1e20;\r\n  vec2 closestId = id;\r\n\r\n  for (int j=0; j<2; j++)\r\n  for (int i=0; i<2; i++){\r\n    vec2 rid = id + vec2(i,j)*o;\r\n    vec2 rp = p - s*rid;\r\n    if (mod(rid.y, 2.0) == 1.0) {\r\n      rp.x += 1.0;\r\n    }\r\n    float currentDistance = sdHexagon(rp, r);\r\n    if (currentDistance < d) {\r\n      d = currentDistance;\r\n      closestId = rid;\r\n    }\r\n  }\r\n  id = closestId;\r\n  return d;\r\n}\r\n\r\nfloat rand(float seed) {\r\n  return fract(sin(seed) * 43758.5453);\r\n}\r\n\r\nvec3 rgbToHsl(vec3 rgb) {\r\n    float maxVal = max(max(rgb.r, rgb.g), rgb.b);\r\n    float minVal = min(min(rgb.r, rgb.g), rgb.b);\r\n    float chroma = maxVal - minVal;\r\n    float hue = 0.0;\r\n    float saturation = 0.0;\r\n    float lightness = (maxVal + minVal) / 2.0;\r\n\r\n    if (chroma != 0.0) {\r\n        if (maxVal == rgb.r) {\r\n            hue = (rgb.g - rgb.b) / chroma;\r\n            if (hue < 0.0) hue += 6.0;\r\n        } else if (maxVal == rgb.g) {\r\n            hue = (rgb.b - rgb.r) / chroma + 2.0;\r\n        } else {\r\n            hue = (rgb.r - rgb.g) / chroma + 4.0;\r\n        }\r\n\r\n        saturation = chroma / (1.0 - abs(2.0 * lightness - 1.0));\r\n    }\r\n\r\n    return vec3(hue, saturation, lightness);\r\n}\r\n\r\nvec3 hslToRgb(vec3 hsl) {\r\n    float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;\r\n    float X = C * (1.0 - abs(mod(hsl.x, 2.0) - 1.0));\r\n    float m = hsl.z - C / 2.0;\r\n    vec3 rgb;\r\n    if (hsl.x < 1.0) {\r\n        rgb = vec3(C, X, 0.0);\r\n    } else if (hsl.x < 2.0) {\r\n        rgb = vec3(X, C, 0.0);\r\n    } else if (hsl.x < 3.0) {\r\n        rgb = vec3(0.0, C, X);\r\n    } else if (hsl.x < 4.0) {\r\n        rgb = vec3(0.0, X, C);\r\n    } else if (hsl.x < 5.0) {\r\n        rgb = vec3(X, 0.0, C);\r\n    } else {\r\n        rgb = vec3(C, 0.0, X);\r\n    }\r\n    return rgb + vec3(m);\r\n}\r\n\r\nvoid main() {\r\n    float scale = (uResolution.x < 600.0) ? 24.0 : 12.0;\r\n    vec2 p = scale* (2.0*gl_FragCoord.xy-uResolution.xy)/uResolution.y;\r\n\r\n    vec2 id;\r\n    float radius = 0.8;\r\n    float halfSpacing = 2.0;\r\n    float numShapesX = uResolution.x / (radius * uResolution.y);\r\n    float numShapesY = 1.0 / radius;\r\n    vec2 numShapes = vec2(numShapesX, numShapesY);\r\n    vec2 lima = vec2(-numShapesX - 1.0 / 2.0, -numShapesY - 1.0 / 2.0);\r\n    vec2 limb = -lima;\r\n    float d = repeat(p, radius, halfSpacing, lima, limb, numShapes, id);\r\n\r\n    float noiseSpeed = 0.0001;\r\n    float texOffset = noiseSpeed * uTime;\r\n    vec2 texCoord = (id + texOffset) / uNoiseTexResolution;\r\n    //if (mod(id.y, 2.0) == 1.0) {\r\n    //  texCoord -= radius / 2.0;\r\n    //}\r\n    vec4 noiseVal = texture2D(uNoiseTex, texCoord);\r\n\r\n    float hueSpeed = 0.000025; // Adjust the speed as needed\r\n    float hueOffset = uTime * hueSpeed;\r\n    float hue = mod(hueOffset, 6.0); // Map the range to 0.0 - 6.0\r\n    float lightOffset = 0.05;\r\n    vec3 hexCol = hslToRgb(vec3(hue, 0.5, noiseVal.r + lightOffset));\r\n    vec3 bgCol = vec3(0.5, 0.5, 0.5);\r\n\r\n    vec3 col;\r\n\r\n    float thresh = 0.035;\r\n\r\n    if (0.0 < d  && d < thresh) {\r\n      float alpha = smoothstep(0.0, thresh, d);\r\n      col = mix(hexCol, bgCol, alpha);\r\n    } else {\r\n      col = (d < 0.0) ? hexCol : bgCol;\r\n    }\r\n    \r\n    // for visual debugging\r\n    // colorize\r\n    // vec3 col = (d>0.0) ? vec3(0.9,0.6,0.3) : vec3(0.65,0.85,1.0);\r\n    // col *= 1.0 - exp(-6.0*abs(d));\r\n    // col *= 0.8 + 0.2*cos(31.416*d);\r\n    // col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.035,abs(d)) );\r\n\r\n    // distance samples\r\n    // vec2 m = vec2(3.5,2.0)*sin( 0.3*uTime*vec2(1.1,1.3)+vec2(0,2));\r\n    // col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.007, abs(length(p-m)-abs(d))-0.015));\r\n    // col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.007, length(p-m)-0.08));\r\n\r\n    gl_FragColor = vec4(col, 1.0);\r\n}\r\n`;\r\n\r\nfunction compileShader(gl, source, type) {\r\n  const shader = gl.createShader(type);\r\n  gl.shaderSource(shader, source);\r\n  gl.compileShader(shader);\r\n  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {\r\n    console.error(\r\n      \"An error occurred compiling the shaders: \" + gl.getShaderInfoLog(shader)\r\n    );\r\n    gl.deleteShader(shader);\r\n    return null;\r\n  }\r\n  return shader;\r\n}\r\n\r\nconst vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);\r\nconst fragmentShader = compileShader(\r\n  gl,\r\n  fragmentShaderSource,\r\n  gl.FRAGMENT_SHADER\r\n);\r\n\r\nconst program = gl.createProgram();\r\ngl.attachShader(program, vertexShader);\r\ngl.attachShader(program, fragmentShader);\r\ngl.linkProgram(program);\r\n\r\nif (!gl.getProgramParameter(program, gl.LINK_STATUS)) {\r\n  console.error(\r\n    \"Unable to initialize the shader program: \" + gl.getProgramInfoLog(program)\r\n  );\r\n}\r\n\r\ngl.useProgram(program);\r\n\r\nconst vertexBuffer = gl.createBuffer();\r\ngl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);\r\ngl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);\r\n\r\nconst indexBuffer = gl.createBuffer();\r\ngl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);\r\ngl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);\r\n\r\nconst positionAttributeLocation = gl.getAttribLocation(program, \"aPosition\");\r\ngl.enableVertexAttribArray(positionAttributeLocation);\r\ngl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);\r\n\r\nconst noise = (0,simplex_noise__WEBPACK_IMPORTED_MODULE_0__.createNoise2D)();\r\n\r\nconst imWidth = 128;\r\nconst imHeight = 128;\r\n\r\nconst freqScale = 0.4;\r\n\r\n// Generate texture\r\nlet noiseTextureData = new Uint8Array(imWidth * imHeight);\r\nfor (let y = 0; y < imHeight; y++) {\r\n  for (let x = 0; x < imWidth; x++) {\r\n    const val = noise(x * freqScale, y * freqScale);\r\n    const idx = y * imWidth + x;\r\n    const col = Math.floor((val + 1) * 128);\r\n    noiseTextureData[idx] = col;\r\n  }\r\n}\r\n\r\nconst noiseTexture = gl.createTexture();\r\ngl.activeTexture(gl.TEXTURE0);\r\ngl.bindTexture(gl.TEXTURE_2D, noiseTexture);\r\n\r\ngl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);\r\ngl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);\r\ngl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);\r\n\r\ngl.texImage2D(\r\n  gl.TEXTURE_2D,\r\n  0,\r\n  gl.LUMINANCE,\r\n  imWidth,\r\n  imHeight,\r\n  0,\r\n  gl.LUMINANCE,\r\n  gl.UNSIGNED_BYTE,\r\n  noiseTextureData\r\n);\r\n\r\ngl.clearColor(1, 1, 1, 1);\r\n\r\nconst uResolution = gl.getUniformLocation(program, \"uResolution\");\r\nconst uNoiseTexResolution = gl.getUniformLocation(\r\n  program,\r\n  \"uNoiseTexResolution\"\r\n);\r\nconst uTime = gl.getUniformLocation(program, \"uTime\");\r\nconst uNoiseTex = gl.getUniformLocation(program, \"uNoiseTex\");\r\n\r\ngl.uniform1i(uNoiseTex, 0);\r\ngl.uniform2f(uNoiseTexResolution, imWidth, imHeight);\r\n\r\nfunction resizeCanvasToDisplaySize() {\r\n  // Ensure the logical size and display size are equal\r\n\r\n  const canvas = document.getElementById(\"webglcanvas\");\r\n  const width = canvas.clientWidth;\r\n  const height = canvas.clientHeight;\r\n\r\n  if (canvas.width !== width || canvas.height !== height) {\r\n    canvas.width = width;\r\n    canvas.height = height;\r\n    gl.viewport(0, 0, width, height);\r\n  }\r\n}\r\n\r\nwindow.addEventListener(\"resize\", resizeCanvasToDisplaySize);\r\n\r\nlet prevTimestamp = performance.now();\r\n\r\nfunction render(currTimestamp) {\r\n  const dt = (currTimestamp - prevTimestamp) / 1000;\r\n  prevTimestamp = currTimestamp;\r\n\r\n  gl.clear(gl.COLOR_BUFFER_BIT);\r\n\r\n  gl.uniform1f(uTime, currTimestamp);\r\n  gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);\r\n\r\n  gl.drawArrays(gl.TRIANGLES, 0, indices.length);\r\n\r\n  requestAnimationFrame(render);\r\n}\r\n\r\nresizeCanvasToDisplaySize();\r\nrender();\r\n\n\n//# sourceURL=webpack://colorlab/./src/core/static/core/js/renderer.js?");

/***/ }),

/***/ "./node_modules/simplex-noise/dist/esm/simplex-noise.js":
/*!**************************************************************!*\
  !*** ./node_modules/simplex-noise/dist/esm/simplex-noise.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   buildPermutationTable: () => (/* binding */ buildPermutationTable),\n/* harmony export */   createNoise2D: () => (/* binding */ createNoise2D),\n/* harmony export */   createNoise3D: () => (/* binding */ createNoise3D),\n/* harmony export */   createNoise4D: () => (/* binding */ createNoise4D)\n/* harmony export */ });\n/*\n * A fast javascript implementation of simplex noise by Jonas Wagner\n\nBased on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.\nWhich is based on example code by Stefan Gustavson (stegu@itn.liu.se).\nWith Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).\nBetter rank ordering method by Stefan Gustavson in 2012.\n\n Copyright (c) 2022 Jonas Wagner\n\n Permission is hereby granted, free of charge, to any person obtaining a copy\n of this software and associated documentation files (the \"Software\"), to deal\n in the Software without restriction, including without limitation the rights\n to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n copies of the Software, and to permit persons to whom the Software is\n furnished to do so, subject to the following conditions:\n\n The above copyright notice and this permission notice shall be included in all\n copies or substantial portions of the Software.\n\n THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n SOFTWARE.\n */\n// these #__PURE__ comments help uglifyjs with dead code removal\n// \nconst F2 = /*#__PURE__*/ 0.5 * (Math.sqrt(3.0) - 1.0);\nconst G2 = /*#__PURE__*/ (3.0 - Math.sqrt(3.0)) / 6.0;\nconst F3 = 1.0 / 3.0;\nconst G3 = 1.0 / 6.0;\nconst F4 = /*#__PURE__*/ (Math.sqrt(5.0) - 1.0) / 4.0;\nconst G4 = /*#__PURE__*/ (5.0 - Math.sqrt(5.0)) / 20.0;\n// I'm really not sure why this | 0 (basically a coercion to int)\n// is making this faster but I get ~5 million ops/sec more on the\n// benchmarks across the board or a ~10% speedup.\nconst fastFloor = (x) => Math.floor(x) | 0;\nconst grad2 = /*#__PURE__*/ new Float64Array([1, 1,\n    -1, 1,\n    1, -1,\n    -1, -1,\n    1, 0,\n    -1, 0,\n    1, 0,\n    -1, 0,\n    0, 1,\n    0, -1,\n    0, 1,\n    0, -1]);\n// double seems to be faster than single or int's\n// probably because most operations are in double precision\nconst grad3 = /*#__PURE__*/ new Float64Array([1, 1, 0,\n    -1, 1, 0,\n    1, -1, 0,\n    -1, -1, 0,\n    1, 0, 1,\n    -1, 0, 1,\n    1, 0, -1,\n    -1, 0, -1,\n    0, 1, 1,\n    0, -1, 1,\n    0, 1, -1,\n    0, -1, -1]);\n// double is a bit quicker here as well\nconst grad4 = /*#__PURE__*/ new Float64Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,\n    0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,\n    1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,\n    -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,\n    1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,\n    -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,\n    1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,\n    -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]);\n/**\n * Creates a 2D noise function\n * @param random the random function that will be used to build the permutation table\n * @returns {NoiseFunction2D}\n */\nfunction createNoise2D(random = Math.random) {\n    const perm = buildPermutationTable(random);\n    // precalculating this yields a little ~3% performance improvement.\n    const permGrad2x = new Float64Array(perm).map(v => grad2[(v % 12) * 2]);\n    const permGrad2y = new Float64Array(perm).map(v => grad2[(v % 12) * 2 + 1]);\n    return function noise2D(x, y) {\n        // if(!isFinite(x) || !isFinite(y)) return 0;\n        let n0 = 0; // Noise contributions from the three corners\n        let n1 = 0;\n        let n2 = 0;\n        // Skew the input space to determine which simplex cell we're in\n        const s = (x + y) * F2; // Hairy factor for 2D\n        const i = fastFloor(x + s);\n        const j = fastFloor(y + s);\n        const t = (i + j) * G2;\n        const X0 = i - t; // Unskew the cell origin back to (x,y) space\n        const Y0 = j - t;\n        const x0 = x - X0; // The x,y distances from the cell origin\n        const y0 = y - Y0;\n        // For the 2D case, the simplex shape is an equilateral triangle.\n        // Determine which simplex we are in.\n        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords\n        if (x0 > y0) {\n            i1 = 1;\n            j1 = 0;\n        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)\n        else {\n            i1 = 0;\n            j1 = 1;\n        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)\n        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and\n        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where\n        // c = (3-sqrt(3))/6\n        const x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords\n        const y1 = y0 - j1 + G2;\n        const x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords\n        const y2 = y0 - 1.0 + 2.0 * G2;\n        // Work out the hashed gradient indices of the three simplex corners\n        const ii = i & 255;\n        const jj = j & 255;\n        // Calculate the contribution from the three corners\n        let t0 = 0.5 - x0 * x0 - y0 * y0;\n        if (t0 >= 0) {\n            const gi0 = ii + perm[jj];\n            const g0x = permGrad2x[gi0];\n            const g0y = permGrad2y[gi0];\n            t0 *= t0;\n            // n0 = t0 * t0 * (grad2[gi0] * x0 + grad2[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient\n            n0 = t0 * t0 * (g0x * x0 + g0y * y0);\n        }\n        let t1 = 0.5 - x1 * x1 - y1 * y1;\n        if (t1 >= 0) {\n            const gi1 = ii + i1 + perm[jj + j1];\n            const g1x = permGrad2x[gi1];\n            const g1y = permGrad2y[gi1];\n            t1 *= t1;\n            // n1 = t1 * t1 * (grad2[gi1] * x1 + grad2[gi1 + 1] * y1);\n            n1 = t1 * t1 * (g1x * x1 + g1y * y1);\n        }\n        let t2 = 0.5 - x2 * x2 - y2 * y2;\n        if (t2 >= 0) {\n            const gi2 = ii + 1 + perm[jj + 1];\n            const g2x = permGrad2x[gi2];\n            const g2y = permGrad2y[gi2];\n            t2 *= t2;\n            // n2 = t2 * t2 * (grad2[gi2] * x2 + grad2[gi2 + 1] * y2);\n            n2 = t2 * t2 * (g2x * x2 + g2y * y2);\n        }\n        // Add contributions from each corner to get the final noise value.\n        // The result is scaled to return values in the interval [-1,1].\n        return 70.0 * (n0 + n1 + n2);\n    };\n}\n/**\n * Creates a 3D noise function\n * @param random the random function that will be used to build the permutation table\n * @returns {NoiseFunction3D}\n */\nfunction createNoise3D(random = Math.random) {\n    const perm = buildPermutationTable(random);\n    // precalculating these seems to yield a speedup of over 15%\n    const permGrad3x = new Float64Array(perm).map(v => grad3[(v % 12) * 3]);\n    const permGrad3y = new Float64Array(perm).map(v => grad3[(v % 12) * 3 + 1]);\n    const permGrad3z = new Float64Array(perm).map(v => grad3[(v % 12) * 3 + 2]);\n    return function noise3D(x, y, z) {\n        let n0, n1, n2, n3; // Noise contributions from the four corners\n        // Skew the input space to determine which simplex cell we're in\n        const s = (x + y + z) * F3; // Very nice and simple skew factor for 3D\n        const i = fastFloor(x + s);\n        const j = fastFloor(y + s);\n        const k = fastFloor(z + s);\n        const t = (i + j + k) * G3;\n        const X0 = i - t; // Unskew the cell origin back to (x,y,z) space\n        const Y0 = j - t;\n        const Z0 = k - t;\n        const x0 = x - X0; // The x,y,z distances from the cell origin\n        const y0 = y - Y0;\n        const z0 = z - Z0;\n        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.\n        // Determine which simplex we are in.\n        let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords\n        let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords\n        if (x0 >= y0) {\n            if (y0 >= z0) {\n                i1 = 1;\n                j1 = 0;\n                k1 = 0;\n                i2 = 1;\n                j2 = 1;\n                k2 = 0;\n            } // X Y Z order\n            else if (x0 >= z0) {\n                i1 = 1;\n                j1 = 0;\n                k1 = 0;\n                i2 = 1;\n                j2 = 0;\n                k2 = 1;\n            } // X Z Y order\n            else {\n                i1 = 0;\n                j1 = 0;\n                k1 = 1;\n                i2 = 1;\n                j2 = 0;\n                k2 = 1;\n            } // Z X Y order\n        }\n        else { // x0<y0\n            if (y0 < z0) {\n                i1 = 0;\n                j1 = 0;\n                k1 = 1;\n                i2 = 0;\n                j2 = 1;\n                k2 = 1;\n            } // Z Y X order\n            else if (x0 < z0) {\n                i1 = 0;\n                j1 = 1;\n                k1 = 0;\n                i2 = 0;\n                j2 = 1;\n                k2 = 1;\n            } // Y Z X order\n            else {\n                i1 = 0;\n                j1 = 1;\n                k1 = 0;\n                i2 = 1;\n                j2 = 1;\n                k2 = 0;\n            } // Y X Z order\n        }\n        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),\n        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and\n        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where\n        // c = 1/6.\n        const x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords\n        const y1 = y0 - j1 + G3;\n        const z1 = z0 - k1 + G3;\n        const x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords\n        const y2 = y0 - j2 + 2.0 * G3;\n        const z2 = z0 - k2 + 2.0 * G3;\n        const x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords\n        const y3 = y0 - 1.0 + 3.0 * G3;\n        const z3 = z0 - 1.0 + 3.0 * G3;\n        // Work out the hashed gradient indices of the four simplex corners\n        const ii = i & 255;\n        const jj = j & 255;\n        const kk = k & 255;\n        // Calculate the contribution from the four corners\n        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;\n        if (t0 < 0)\n            n0 = 0.0;\n        else {\n            const gi0 = ii + perm[jj + perm[kk]];\n            t0 *= t0;\n            n0 = t0 * t0 * (permGrad3x[gi0] * x0 + permGrad3y[gi0] * y0 + permGrad3z[gi0] * z0);\n        }\n        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;\n        if (t1 < 0)\n            n1 = 0.0;\n        else {\n            const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1]];\n            t1 *= t1;\n            n1 = t1 * t1 * (permGrad3x[gi1] * x1 + permGrad3y[gi1] * y1 + permGrad3z[gi1] * z1);\n        }\n        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;\n        if (t2 < 0)\n            n2 = 0.0;\n        else {\n            const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2]];\n            t2 *= t2;\n            n2 = t2 * t2 * (permGrad3x[gi2] * x2 + permGrad3y[gi2] * y2 + permGrad3z[gi2] * z2);\n        }\n        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;\n        if (t3 < 0)\n            n3 = 0.0;\n        else {\n            const gi3 = ii + 1 + perm[jj + 1 + perm[kk + 1]];\n            t3 *= t3;\n            n3 = t3 * t3 * (permGrad3x[gi3] * x3 + permGrad3y[gi3] * y3 + permGrad3z[gi3] * z3);\n        }\n        // Add contributions from each corner to get the final noise value.\n        // The result is scaled to stay just inside [-1,1]\n        return 32.0 * (n0 + n1 + n2 + n3);\n    };\n}\n/**\n * Creates a 4D noise function\n * @param random the random function that will be used to build the permutation table\n * @returns {NoiseFunction4D}\n */\nfunction createNoise4D(random = Math.random) {\n    const perm = buildPermutationTable(random);\n    // precalculating these leads to a ~10% speedup\n    const permGrad4x = new Float64Array(perm).map(v => grad4[(v % 32) * 4]);\n    const permGrad4y = new Float64Array(perm).map(v => grad4[(v % 32) * 4 + 1]);\n    const permGrad4z = new Float64Array(perm).map(v => grad4[(v % 32) * 4 + 2]);\n    const permGrad4w = new Float64Array(perm).map(v => grad4[(v % 32) * 4 + 3]);\n    return function noise4D(x, y, z, w) {\n        let n0, n1, n2, n3, n4; // Noise contributions from the five corners\n        // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in\n        const s = (x + y + z + w) * F4; // Factor for 4D skewing\n        const i = fastFloor(x + s);\n        const j = fastFloor(y + s);\n        const k = fastFloor(z + s);\n        const l = fastFloor(w + s);\n        const t = (i + j + k + l) * G4; // Factor for 4D unskewing\n        const X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space\n        const Y0 = j - t;\n        const Z0 = k - t;\n        const W0 = l - t;\n        const x0 = x - X0; // The x,y,z,w distances from the cell origin\n        const y0 = y - Y0;\n        const z0 = z - Z0;\n        const w0 = w - W0;\n        // For the 4D case, the simplex is a 4D shape I won't even try to describe.\n        // To find out which of the 24 possible simplices we're in, we need to\n        // determine the magnitude ordering of x0, y0, z0 and w0.\n        // Six pair-wise comparisons are performed between each possible pair\n        // of the four coordinates, and the results are used to rank the numbers.\n        let rankx = 0;\n        let ranky = 0;\n        let rankz = 0;\n        let rankw = 0;\n        if (x0 > y0)\n            rankx++;\n        else\n            ranky++;\n        if (x0 > z0)\n            rankx++;\n        else\n            rankz++;\n        if (x0 > w0)\n            rankx++;\n        else\n            rankw++;\n        if (y0 > z0)\n            ranky++;\n        else\n            rankz++;\n        if (y0 > w0)\n            ranky++;\n        else\n            rankw++;\n        if (z0 > w0)\n            rankz++;\n        else\n            rankw++;\n        // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.\n        // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w\n        // impossible. Only the 24 indices which have non-zero entries make any sense.\n        // We use a thresholding to set the coordinates in turn from the largest magnitude.\n        // Rank 3 denotes the largest coordinate.\n        // Rank 2 denotes the second largest coordinate.\n        // Rank 1 denotes the second smallest coordinate.\n        // The integer offsets for the second simplex corner\n        const i1 = rankx >= 3 ? 1 : 0;\n        const j1 = ranky >= 3 ? 1 : 0;\n        const k1 = rankz >= 3 ? 1 : 0;\n        const l1 = rankw >= 3 ? 1 : 0;\n        // The integer offsets for the third simplex corner\n        const i2 = rankx >= 2 ? 1 : 0;\n        const j2 = ranky >= 2 ? 1 : 0;\n        const k2 = rankz >= 2 ? 1 : 0;\n        const l2 = rankw >= 2 ? 1 : 0;\n        // The integer offsets for the fourth simplex corner\n        const i3 = rankx >= 1 ? 1 : 0;\n        const j3 = ranky >= 1 ? 1 : 0;\n        const k3 = rankz >= 1 ? 1 : 0;\n        const l3 = rankw >= 1 ? 1 : 0;\n        // The fifth corner has all coordinate offsets = 1, so no need to compute that.\n        const x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords\n        const y1 = y0 - j1 + G4;\n        const z1 = z0 - k1 + G4;\n        const w1 = w0 - l1 + G4;\n        const x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords\n        const y2 = y0 - j2 + 2.0 * G4;\n        const z2 = z0 - k2 + 2.0 * G4;\n        const w2 = w0 - l2 + 2.0 * G4;\n        const x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords\n        const y3 = y0 - j3 + 3.0 * G4;\n        const z3 = z0 - k3 + 3.0 * G4;\n        const w3 = w0 - l3 + 3.0 * G4;\n        const x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords\n        const y4 = y0 - 1.0 + 4.0 * G4;\n        const z4 = z0 - 1.0 + 4.0 * G4;\n        const w4 = w0 - 1.0 + 4.0 * G4;\n        // Work out the hashed gradient indices of the five simplex corners\n        const ii = i & 255;\n        const jj = j & 255;\n        const kk = k & 255;\n        const ll = l & 255;\n        // Calculate the contribution from the five corners\n        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;\n        if (t0 < 0)\n            n0 = 0.0;\n        else {\n            const gi0 = ii + perm[jj + perm[kk + perm[ll]]];\n            t0 *= t0;\n            n0 = t0 * t0 * (permGrad4x[gi0] * x0 + permGrad4y[gi0] * y0 + permGrad4z[gi0] * z0 + permGrad4w[gi0] * w0);\n        }\n        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;\n        if (t1 < 0)\n            n1 = 0.0;\n        else {\n            const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]];\n            t1 *= t1;\n            n1 = t1 * t1 * (permGrad4x[gi1] * x1 + permGrad4y[gi1] * y1 + permGrad4z[gi1] * z1 + permGrad4w[gi1] * w1);\n        }\n        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;\n        if (t2 < 0)\n            n2 = 0.0;\n        else {\n            const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]];\n            t2 *= t2;\n            n2 = t2 * t2 * (permGrad4x[gi2] * x2 + permGrad4y[gi2] * y2 + permGrad4z[gi2] * z2 + permGrad4w[gi2] * w2);\n        }\n        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;\n        if (t3 < 0)\n            n3 = 0.0;\n        else {\n            const gi3 = ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]];\n            t3 *= t3;\n            n3 = t3 * t3 * (permGrad4x[gi3] * x3 + permGrad4y[gi3] * y3 + permGrad4z[gi3] * z3 + permGrad4w[gi3] * w3);\n        }\n        let t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;\n        if (t4 < 0)\n            n4 = 0.0;\n        else {\n            const gi4 = ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]];\n            t4 *= t4;\n            n4 = t4 * t4 * (permGrad4x[gi4] * x4 + permGrad4y[gi4] * y4 + permGrad4z[gi4] * z4 + permGrad4w[gi4] * w4);\n        }\n        // Sum up and scale the result to cover the range [-1,1]\n        return 27.0 * (n0 + n1 + n2 + n3 + n4);\n    };\n}\n/**\n * Builds a random permutation table.\n * This is exported only for (internal) testing purposes.\n * Do not rely on this export.\n * @private\n */\nfunction buildPermutationTable(random) {\n    const tableSize = 512;\n    const p = new Uint8Array(tableSize);\n    for (let i = 0; i < tableSize / 2; i++) {\n        p[i] = i;\n    }\n    for (let i = 0; i < tableSize / 2 - 1; i++) {\n        const r = i + ~~(random() * (256 - i));\n        const aux = p[i];\n        p[i] = p[r];\n        p[r] = aux;\n    }\n    for (let i = 256; i < tableSize; i++) {\n        p[i] = p[i - 256];\n    }\n    return p;\n}\n//# sourceMappingURL=simplex-noise.js.map\n\n//# sourceURL=webpack://colorlab/./node_modules/simplex-noise/dist/esm/simplex-noise.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/core/static/core/js/renderer.js");
/******/ 	
/******/ })()
;