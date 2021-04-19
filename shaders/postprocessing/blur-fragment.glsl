#version 300 es
precision highp float;
in vec2 v_position;
uniform sampler2D u_texture;
uniform sampler2D u_depth;
uniform vec2 u_resolution;
out vec4 o_color;
void main () {
    vec3 c = vec3(0, 0, 0);
    float depth = texture(u_depth, v_position).r;
    int spread = int(10.0);
    for (int dx = -spread; dx <= spread; dx ++) {
        vec2 uv = v_position + vec2(dx, 0.0) / (u_resolution);
        c += texture(u_texture, uv).rgb;
    }
    for (int dy = -spread; dy <= spread; dy ++) {
        vec2 uv = v_position + vec2(0.0, dy) / (u_resolution);
        c += texture(u_texture, uv).rgb;
    }

    c /= 4.0 * float(spread) + 1.0;
    c *= 2.;
    o_color = vec4(c, 1);
}