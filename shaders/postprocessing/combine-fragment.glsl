#version 300 es
precision highp float;
in vec2 v_position;
uniform sampler2D u_original;
uniform sampler2D u_blurred;
out vec4 o_color;
void main () {
    o_color = texture(u_blurred, v_position) + texture(u_original, v_position);
}