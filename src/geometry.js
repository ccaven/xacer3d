/**
 * @module geometry.js
 */

import { DisplayContext } from "../src/webgl.js";

class Buffer {

    constructor (type, length) {

    }

}

class Mesh {

    /**
     *
     * @param {DisplayContext} displayContext
     * @param  {...any} buffers
     */
    constructor (displayContext, ...buffers) {

        this.displayContext = displayContext;
        this.gl = this.displayContext.gl;

        this.vertexArray = this.gl.createVertexArray();

        this.buffers = {};
        this.types = {};
        this.data = {};

        for (let i = 0; i < buffers.length; i ++) {
            let name = buffers[i].name;
            let sizes = buffers[i].size;


        }

    }

}

export { Mesh };
