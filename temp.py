import math

vals = [
    [0.658, 0.618, 0.908],
    [0.908, 0.768, -1.032],
    [0.171, 0.454, -0.452],
    [0.658, 1.418, 2.178],
]

norm_vals = []
for i, vec in enumerate(vals):
    norm_vec = []
    for v in vec:
        norm_vec.append(round((v + math.pi) / (2.0 * math.pi), 3))
    norm_vals.append(norm_vec)

print(norm_vals)

#define PI 3.14159265
#define NEUTRAL_GRAY vec3(0.5, 0.5, 0.5)
#define ANIMATE false

vec3 samplePalette( in float t, in vec3 amp, in vec3 bias, in vec3 freq, in vec3 phase)
{
    return amp*cos(2.0*PI*(freq*t+phase)) + bias;
}

vec2 grad( vec2 x )
{
    vec2 h = vec2( 0.01, 0.0 );
    return vec2( f(x+h.xy) - f(x-h.xy),
                 f(x+h.yx) - f(x-h.yx) )/(2.0*h.x);
}

float estimateDistance( in vec2 p )
{
    float g = abs(f - p.y);
    float 
    return d;
}

vec3 drawGraph( in float y, in vec3 color ) {
    float lineThickness = 0.1;
    bool onPlot = y - 0.5 < color.r * 0.5;
    vec3 plotCol = vec3(1.0, 0.0, 0.0);
    return onPlot ? plotCol : NEUTRAL_GRAY;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy; // 0 to 1
    
    if (ANIMATE) {
        uv.x += 0.01*iTime; // scroll left
    }
    
    // Normalized wave params for RGB channels
    //vec3 amp = vec3(0.658, 0.618, 0.908);
    //vec3 bias = vec3(0.908, 0.768, -1.032);
    //vec3 freq = vec3(0.171, 0.454, -0.452);
    //vec3 phase = vec3(0.658, 1.418, 2.178);
    
    vec3 amp = vec3(0.605, 0.598, 0.645);
    vec3 bias = vec3(0.645, 0.622, 0.336);
    vec3 freq = vec3(1.0, 1.0, 1.0);
    vec3 phase = vec3(0.60, 0.73, 0.847);
   
    vec3 col = samplePalette(uv.x, amp, bias, freq, phase);
    if (uv.y > 0.5) col = drawGraph(uv.y, col);
    
    fragColor = vec4(col, 1.0);
}

// Exploring color palettes

#define PI 3.14159265
#define NEUTRAL_GRAY vec3(0.5, 0.5, 0.5)
#define RED vec3(1.0, 0.0, 0.0)
#define GREEN vec3(0.0, 1.0, 0.0)
#define BLUE vec3(0.0, 0.0, 1.0)
#define ANIMATE true
// Palette
vec3 samplePalette( in float t, in vec3 amp, in vec3 bias, in vec3 freq, in vec3 phase)
{
    return amp*cos(2.0*PI*(freq*t+phase)) + bias;
}

// Graph drawing
vec3 samplePaletteDerivative (in float t, in vec3 amp, in vec3 bias, in vec3 freq, in vec3 phase)
{
    return amp*freq*(-2.0*PI)*sin(2.0*PI*(freq*t + phase));
}

float estimateDistance( in vec2 p, in float y, in float dy )
{
    float g = abs(p.y - y);
    return g / sqrt(1.0 + dy*dy);
}

vec3 drawGraph( in vec2 p, in vec3 color, in vec3 colorVelocity) {
    float thickness = (iResolution.y / 168.0);
    float w = 1.0 / iResolution.y; // pixel size
    float rd = estimateDistance(p, color.r, colorVelocity.r);
    float gd = estimateDistance(p, color.g, colorVelocity.g);
    float bd = estimateDistance(p, color.b, colorVelocity.b);
    float ralpha = smoothstep((0.5*thickness+2.0)*w, (0.5*thickness+0.0)*w, rd);
    float galpha = smoothstep((0.5*thickness+2.0)*w, (0.5*thickness+0.0)*w, gd);
    float balpha = smoothstep((0.5*thickness+2.0)*w, (0.5*thickness+0.0)*w, bd);
    vec3 col = NEUTRAL_GRAY;
    col = mix(col, RED, ralpha);
    col = mix(col, GREEN, galpha);
    col = mix(col, BLUE, balpha);
    return col;
}

// Main
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy; // 0 to 1
    
    if (ANIMATE) 
    {
        uv.x += 0.01*iTime; // scroll left
    }
    
    // Normalized wave params for RGB channels
    //vec3 amp = vec3(0.658, 0.618, 0.908);
    //vec3 bias = vec3(0.908, 0.768, -1.032);
    //vec3 freq = vec3(0.171, 0.454, -0.452);
    //vec3 phase = vec3(0.658, 1.418, 2.178);
    float bamp = (mod(uv.x, 2.0) == 1.0) ? 0.45 : 0.45*0.6;
    vec3 amp = vec3(0.23, 0.7, bamp);
    vec3 bias = vec3(0.77, 0.3, 0.3);
    vec3 freq = 1.0 / vec3(1.0, 1.0, 0.5);
    vec3 phase = vec3(0.5, 0.5, 0.0);
   
    vec3 col = samplePalette(uv.x, amp, bias, freq, phase);
    if (uv.y > 0.5) 
    {
        vec3 dy = samplePaletteDerivative(uv.x, amp, bias, freq, phase);
        col = drawGraph(uv, col, dy);
    }
    
    fragColor = vec4(col, 1.0);
}
