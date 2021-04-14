#version 300 es
precision highp float;

// Varyings
// These are the incoming variable from the vertex shader
in vec4 v_position;
in vec3 v_normal;
in vec2 v_texcoord;

// Uniforms
// These stay constant through a draw call
uniform sampler2D u_texture;

// Output
// This is the color of the pixel
out vec4 o_color;

// Main function
// This runs for each pixel on each triangle inputted to the shader
void main () {
    o_color = vec4(v_texcoord, 0.5, 1);
}
