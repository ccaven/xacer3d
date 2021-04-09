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

            this.buffers[name] = this.gl.createBuffer();
            this.sizes[name] = sizes;
            this.data[name] = null;
        }

        this.triangleBuffer = this.gl.createBuffer();
    }

    /**
     * Send the data to the buffers
     * @param {Number} mode
     */
    setBuffers (mode=this.gl.STATIC_DRAW) {
        this.gl.bindVertexArray(this.vertexArray);
        for (let name in this.buffers) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data[name], mode);
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.data.triangles, mode);
    }

    /**
     * Set the data of one of the buffers
     * @param {String} name - The name of the buffer
     * @param {Float32Array | Uint16Array} data - The data
     */
    setData (name, data) {
        this.data[name] = data;
    }

    /**
     * Point the buffers to the attributes
     * @param {Renderer} renderer - Renderer instance
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
                this.gl.vertexAttribPointer(loc, this.sizes[name], this.gl.FLOAT, false, 0, 0);
            }
        }
    }

    /**
     * Render the mesh with a renderer
     * @param {Renderer} renderer - Renderer instance
     */
    render (renderer) {
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.useProgram(renderer.program);
        this.gl.drawElements(this.gl.TRIANGLES, this.data.triangles.length, this.gl.UNSIGNED_SHORT, 0);
    }
}

class Cube {

    constructor (position, dimensions) {

    }

}

export { Mesh };
