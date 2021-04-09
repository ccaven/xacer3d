/**
 * @module geometry.js
 */


import { DisplayContext, Renderer } from "../src/webgl.js";

class Mesh {
    /**
     * Create a new Mesh object
     * @param {DisplayContext} displayContext
     * @param  {...any} buffers
     */
    constructor (displayContext, ...buffers) {

        this.displayContext = displayContext;
        this.gl = this.displayContext.gl;

        this.vertexArray = this.gl.createVertexArray();

        this.buffers = {};
        this.types = {};
        this.sizes = {};
        this.data = {};

        for (let i = 0; i < buffers.length; i ++) {
            let name = buffers[i].name;
            let sizes = buffers[i].size;

            this.buffers[name] = gl.createBuffer();
            this.sizes[name] = sizes;
            this.data[name] = null;
        }

        this.triangleBuffer = gl.createBuffer();
    }

    /**
     * Send the data to the buffers
     * @param {Number} mode
     */
    setData (mode=this.gl.STATIC_DRAW) {
        this.gl.bindVertexArray(this.vertexArray);
        for (let name in this.buffers) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
            this.gl.bufferData(gl.ARRAY_BUFFER, this.data[name], mode);
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.data.triangles, mode);
    }

    /**
     * Point the buffers to the attributes
     * @param {Renderer} renderer
     */
    setAttribPointers (renderer) {
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.useProgram(renderer.program);
        for (let name in this.buffers) {
            let attribName = "a_" + name;
            if (renderer.locations.hasOwnProperty(attribName)) {
                let loc = renderer.locations[attribName];
                this.gl.enableVertexAttribArray(loc);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
                this.gl.vertexAttribPointer(loc, this.sizes[name], gl.FLOAT, false, 0, 0);
            }
        }
    }

    /**
     * Render the mesh with a renderer
     * @param {Renderer} renderer
     */
    render (renderer) {
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.useProgram(renderer.program);
        this.gl.drawElements(this.gl.TRIANGLES, this.data.triangles.length, this.gl.UNSIGNED_SHORT, 0);
    }
}

export { Mesh };
