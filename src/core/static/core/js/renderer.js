import { createNoise2D } from "simplex-noise";

class CanvasNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "CanvasNotFoundError";
  }
}
const targetElementId = "webglcanvas";
const canvas = document.getElementById(targetElementId);

if (!canvas) {
  throw new CanvasNotFoundError(
    `Canvas element with id=${targetElementId} was not found in html doc!`
  );
}

const gl = canvas.getContext("webgl");

const vertices = new Float32Array([
  -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
]);

const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);

const vertexShaderSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 uResolution;
uniform vec2 uNoiseTexResolution;
uniform float uTime;
uniform sampler2D uNoiseTex;

float sdHexagon(in vec2 p, in float r) {
  const vec3 k = vec3(-0.866025404,0.5,0.577350269);
  p = abs(p);
  p -= 2.0*min(dot(k.xy, p), 0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p)*sign(p.y);
}

float repeat(in vec2 p, in float r, in float s, in vec2 lima, in vec2 limb, in vec2 numShapes, out vec2 id) {
  //id = clamp(floor(p/s + 0.5), lima, limb);
  id = floor(p/s + 0.5);
  vec2 o = sign(p-s*id);

  float d = 1e20;
  vec2 closestId = id;

  for (int j=0; j<2; j++)
  for (int i=0; i<2; i++){
    vec2 rid = id + vec2(i,j)*o;
    vec2 rp = p - s*rid;
    if (mod(rid.y, 2.0) == 1.0) {
      rp.x += 1.0;
    }
    float currentDistance = sdHexagon(rp, r);
    if (currentDistance < d) {
      d = currentDistance;
      closestId = rid;
    }
  }
  id = closestId;
  return d;
}

float rand(float seed) {
  return fract(sin(seed) * 43758.5453);
}

vec3 rgbToHsl(vec3 rgb) {
    float maxVal = max(max(rgb.r, rgb.g), rgb.b);
    float minVal = min(min(rgb.r, rgb.g), rgb.b);
    float chroma = maxVal - minVal;
    float hue = 0.0;
    float saturation = 0.0;
    float lightness = (maxVal + minVal) / 2.0;

    if (chroma != 0.0) {
        if (maxVal == rgb.r) {
            hue = (rgb.g - rgb.b) / chroma;
            if (hue < 0.0) hue += 6.0;
        } else if (maxVal == rgb.g) {
            hue = (rgb.b - rgb.r) / chroma + 2.0;
        } else {
            hue = (rgb.r - rgb.g) / chroma + 4.0;
        }

        saturation = chroma / (1.0 - abs(2.0 * lightness - 1.0));
    }

    return vec3(hue, saturation, lightness);
}

vec3 hslToRgb(vec3 hsl) {
    float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
    float X = C * (1.0 - abs(mod(hsl.x, 2.0) - 1.0));
    float m = hsl.z - C / 2.0;
    vec3 rgb;
    if (hsl.x < 1.0) {
        rgb = vec3(C, X, 0.0);
    } else if (hsl.x < 2.0) {
        rgb = vec3(X, C, 0.0);
    } else if (hsl.x < 3.0) {
        rgb = vec3(0.0, C, X);
    } else if (hsl.x < 4.0) {
        rgb = vec3(0.0, X, C);
    } else if (hsl.x < 5.0) {
        rgb = vec3(X, 0.0, C);
    } else {
        rgb = vec3(C, 0.0, X);
    }
    return rgb + vec3(m);
}

void main() {
    float scale = (uResolution.x < 600.0) ? 24.0 : 12.0;
    vec2 p = scale* (2.0*gl_FragCoord.xy-uResolution.xy)/uResolution.y;

    vec2 id;
    float radius = 0.8;
    float halfSpacing = 2.0;
    float numShapesX = uResolution.x / (radius * uResolution.y);
    float numShapesY = 1.0 / radius;
    vec2 numShapes = vec2(numShapesX, numShapesY);
    vec2 lima = vec2(-numShapesX - 1.0 / 2.0, -numShapesY - 1.0 / 2.0);
    vec2 limb = -lima;
    float d = repeat(p, radius, halfSpacing, lima, limb, numShapes, id);

    float noiseSpeed = 0.0001;
    float texOffset = noiseSpeed * uTime;
    vec2 texCoord = (id + texOffset) / uNoiseTexResolution;
    //if (mod(id.y, 2.0) == 1.0) {
    //  texCoord -= radius / 2.0;
    //}
    vec4 noiseVal = texture2D(uNoiseTex, texCoord);

    float hueSpeed = 0.000025; // Adjust the speed as needed
    float hueOffset = uTime * hueSpeed;
    float hue = mod(hueOffset, 6.0); // Map the range to 0.0 - 6.0
    float lightOffset = 0.05;
    vec3 hexCol = hslToRgb(vec3(hue, 0.5, noiseVal.r + lightOffset));
    vec3 bgCol = vec3(0.5, 0.5, 0.5);

    vec3 col;

    float thresh = 0.035;

    if (0.0 < d  && d < thresh) {
      float alpha = smoothstep(0.0, thresh, d);
      col = mix(hexCol, bgCol, alpha);
    } else {
      col = (d < 0.0) ? hexCol : bgCol;
    }
    
    // for visual debugging
    // colorize
    // vec3 col = (d>0.0) ? vec3(0.9,0.6,0.3) : vec3(0.65,0.85,1.0);
    // col *= 1.0 - exp(-6.0*abs(d));
    // col *= 0.8 + 0.2*cos(31.416*d);
    // col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.035,abs(d)) );

    // distance samples
    // vec2 m = vec2(3.5,2.0)*sin( 0.3*uTime*vec2(1.1,1.3)+vec2(0,2));
    // col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.007, abs(length(p-m)-abs(d))-0.015));
    // col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.007, length(p-m)-0.08));

    gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(
  gl,
  fragmentShaderSource,
  gl.FRAGMENT_SHADER
);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(
    "Unable to initialize the shader program: " + gl.getProgramInfoLog(program)
  );
}

gl.useProgram(program);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

const noise = createNoise2D();

const imWidth = 128;
const imHeight = 128;

const freqScale = 0.4;

// Generate texture
let noiseTextureData = new Uint8Array(imWidth * imHeight);
for (let y = 0; y < imHeight; y++) {
  for (let x = 0; x < imWidth; x++) {
    const val = noise(x * freqScale, y * freqScale);
    const idx = y * imWidth + x;
    const col = Math.floor((val + 1) * 128);
    noiseTextureData[idx] = col;
  }
}

const noiseTexture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, noiseTexture);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.LUMINANCE,
  imWidth,
  imHeight,
  0,
  gl.LUMINANCE,
  gl.UNSIGNED_BYTE,
  noiseTextureData
);

gl.clearColor(1, 1, 1, 1);

const uResolution = gl.getUniformLocation(program, "uResolution");
const uNoiseTexResolution = gl.getUniformLocation(
  program,
  "uNoiseTexResolution"
);
const uTime = gl.getUniformLocation(program, "uTime");
const uNoiseTex = gl.getUniformLocation(program, "uNoiseTex");

gl.uniform1i(uNoiseTex, 0);
gl.uniform2f(uNoiseTexResolution, imWidth, imHeight);

function resizeCanvasToDisplaySize() {
  // Ensure the logical size and display size are equal

  const canvas = document.getElementById("webglcanvas");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

window.addEventListener("resize", resizeCanvasToDisplaySize);

let prevTimestamp = performance.now();

function render(currTimestamp) {
  const dt = (currTimestamp - prevTimestamp) / 1000;
  prevTimestamp = currTimestamp;

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform1f(uTime, currTimestamp);
  gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);

  gl.drawArrays(gl.TRIANGLES, 0, indices.length);

  requestAnimationFrame(render);
}

resizeCanvasToDisplaySize();
render();
