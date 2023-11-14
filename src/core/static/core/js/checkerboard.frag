precision mediump float;

uniform vec2 uResolution;  

void main() {
    float size = floor(uResolution.x / 10.0) + 0.5; 
    vec2 pos = floor(gl_FragCoord.xy / size);
    float mask = mod(pos.x + mod(pos.y,2.0), 2.0);
    gl_FragColor = mask * vec4(0.0, 1.0, 1.0, 1.0);
}