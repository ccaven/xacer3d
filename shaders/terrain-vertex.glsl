#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform mat4 u_projection;

out vec4 v_position;
out vec3 v_normal;
out vec2 v_texcoord;

void main () {
    gl_Position = u_projection * vec4(a_position, 1.0);

    v_position = u_projection * vec4(a_position, 1.0);
    v_normal = a_normal;
    v_texcoord = a_texcoord;
}