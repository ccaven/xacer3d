#version 300 es
precision highp float;

in vec4 v_position;
in vec2 v_texcoord;
in vec3 v_normal;
in float v_shadow;

uniform sampler2D u_texture;

out vec4 o_color;

// TODO: Make light a uniform variable
const vec3 light = vec3(0.0, -1.0, 0.0);
const float fogDistance = 20.0;

void main () {

    // TODO: Write better fog shader
    float dist = length(v_position);
    float fog = exp(-max(dist - fogDistance, 0.0));

    o_color = texture(u_texture, v_texcoord) * v_shadow * -dot(v_normal, light) * fog;
}