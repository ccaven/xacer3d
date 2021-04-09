#version 300 es
precision highp float;

in vec4 v_position;
in vec3 v_normal;
in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 o_color;

void main () {
    o_color = vec4(v_texcoord, 0.11, 1);
}
