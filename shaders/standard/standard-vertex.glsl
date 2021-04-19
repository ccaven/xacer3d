#version 300 es
precision highp float;

// Attributes
// These change for each vertex
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

// Uniforms
// These stay constant through a draw call
uniform mat4 u_projection;
uniform mat4 u_model;

// Varyings
// These are passed from the vertex shader to the fragment shader
out vec4 v_position;
out vec3 v_normal;
out vec2 v_texcoord;

// Main function
// This runs for each vertex inputted to the shader
void main () {

    // Translate the vertices to a 1 by 1 by 1 box
    gl_Position = u_projection * u_model * vec4(a_position, 1.0);

    // Set the varyings
    v_position = gl_Position;
    v_normal = a_normal;
    v_texcoord = a_texcoord;
}