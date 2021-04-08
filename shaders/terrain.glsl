#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;
in float a_shadow;

uniform mat4 u_projection;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_texcoord;
out float v_shadow;

void main () {

    gl_Position = u_projection * vec4(a_position, 1.0);

}

// FRAGMENT SHADER
#version 300 es
precision highp float;

in vec3 v_position;
in vec3 v_normal;
in vec2 v_texcoord;
in float v_shadow;

uniform sampler2D u_texture;

out vec4 o_color;

void main () {
    o_color = texture(u_texture, v_texcoord);
}