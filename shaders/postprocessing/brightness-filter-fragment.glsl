#version 300 es
precision highp float;

in vec2 v_position;

uniform sampler2D u_texture;

out vec4 o_color;

void main () {
    vec3 c = texture(u_texture, v_position).rgb;
    if (dot(c, c) < 0.8) o_color = vec4(0, 0, 0, 1);
    else o_color = vec4(c * 0.8, 1);
}