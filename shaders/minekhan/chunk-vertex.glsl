#version 300 es
precision highp float;

in vec3 a_position;
in vec2 a_texcoord;
in vec3 a_normal;
in float a_shadow;

uniform mat4 u_projection;
uniform mat4 u_model;

out vec4 v_position;
out vec2 v_texcoord;
out vec3 v_normal;
out vec3 v_shadow;

void main () {
    gl_Position = u_projection * u_model * vec4(a_position, 1);

    v_position = gl_Position;
    v_texcoord = a_texcoord;
    v_normal = mat3(u_model) * a_normal;
    v_shadow = a_shadow;
}