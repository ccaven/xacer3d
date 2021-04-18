/**
 * @module geometry.js
 */


import { DisplayContext, Renderer } from "../src/webgl.js";
import { Vector2, Vector3, Vector4 } from "./math.js";

/**
 * Stores the needed data for a mesh
 */
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

            let bufferType = this.data[name][0].constructor.name;

            let rawData;

            switch (bufferType) {
                case "Number":
                    rawData = new Float32Array(this.data[name]);
                    break;
                case "Vector2":
                    rawData = new Float32Array(this.data[name].length * 2);
                    for (let i = 0; i < this.data[name].length; i ++) {
                        rawData[i * 2 + 0] = this.data[name][i].x;
                        rawData[i * 2 + 1] = this.data[name][i].y;
                    }
                    break;
                case "Vector3":
                    rawData = new Float32Array(this.data[name].length * 3);
                    for (let i = 0; i < this.data[name].length; i ++) {
                        rawData[i * 3 + 0] = this.data[name][i].x;
                        rawData[i * 3 + 1] = this.data[name][i].y;
                        rawData[i * 3 + 2] = this.data[name][i].z;
                    }
                    break;
                case "Vector4":
                    rawData = new Float32Array(this.data[name].length * 4);
                    for (let i = 0; i < this.data[name].length; i ++) {
                        rawData[i * 4 + 0] = this.data[name][i].x;
                        rawData[i * 4 + 1] = this.data[name][i].y;
                        rawData[i * 4 + 2] = this.data[name][i].z;
                        rawData[i * 4 + 3] = this.data[name][i].w;
                    }
                    break;
                default:
                    throw new Error("Bad data type for attribute: " + bufferType);
            }

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, rawData, mode);
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data.triangles), mode);
    }

    /**
     *
     * @param {String} name
     * @param {Number[] | Vector2[] | Vector3[] | Vector4[]} data
     */
    setData (name, data) {
        this.data[name] = data;
    }

    /**
     * Set the data of one of the buffers
     * @param {String} name - The name of the buffer
     * @param {Float32Array | Uint16Array} data - The data
     */
    setDataRaw (name, data) {
        let size = this.sizes[name];
        if (!size) return;

        this.data[name] = [];

        for (let i = 0; i < data.length; i += size) {

            switch (size) {
                case 1: this.data.push(data[i]); break;
                case 2: this.data.push(new Vector2(data[i], data[i + 1])); break;
                case 3: this.data.push(new Vector3(data[i], data[i + 1], data[i + 2])); break;
                case 4: this.data.push(new Vector4(data[i], data[i + 1], data[i + 2], data[i + 3])); break;
                default:
                    throw new Error("Bad size for buffer, size = " + size);
            }
        }
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

/**
 * Manages the creation of meshes
 */
class MeshGenerator {

    /**
     * Create a new MeshGenerator object
     * @param {DisplayContext} displayContext
     */
    constructor (displayContext, ...meshes) {

        this.displayContext = displayContext;

        /**
         * @type {Mesh[]}
         */
        this.meshes = {};

        for (let index = 0; index < meshes.length; index ++) {
            let meshData = meshes[index];
            this.meshes[meshData.name] = new Mesh(this.displayContext, ...meshData.buffers);
            for (let i = 0; i < meshData.buffers.length; i ++) {
                let bufferName = meshData.buffers[i].name;
                this.meshes[meshData.name].setData(bufferName, meshData.data[bufferName]);
            }
            this.meshes[meshData.name].setData("triangles", meshData.data.triangles);
            this.meshes[meshData.name].setBuffers();
        }
    }

    static getStandard (displayContext) {
        return new MeshGenerator(displayContext,
            /* Basic quad */
            {
                name: "quad",
                buffers: [
                    { name: "position", size: 3},
                    { name: "texcoord", size: 2},
                    { name: "normal", size: 3}
                ],
                data: {
                    position: [
                        new Vector3(-1, -1, 0),
                        new Vector3(-1, 1, 0),
                        new Vector3(1, 1, 0),
                        new Vector3(1, -1, 0)
                    ],
                    texcoord: [
                        new Vector2(0, 0),
                        new Vector2(1, 0),
                        new Vector2(1, 1),
                        new Vector2(0, 1)
                    ],
                    normal: [
                        new Vector3(0, 0, 1),
                        new Vector3(0, 0, 1),
                        new Vector3(0, 0, 1),
                        new Vector3(0, 0, 1),
                    ],
                    triangles: [
                        0, 2, 1,
                        3, 2, 0
                    ],
                },
            },

            {
                name: "cube",
                buffers: [
                    { name: "position", size: 3},
                    { name: "texcoord", size: 2},
                    { name: "normal", size: 3}
                ],
                data: {
                    position: [
                        new Vector3(-1, -1, 1),
                        new Vector3(1, -1, 1),
                        new Vector3(1, 1, 1),
                        new Vector3(-1, 1, 1),

                        new Vector3(-1, -1, -1),
                        new Vector3(-1, 1, -1),
                        new Vector3(1, 1, -1),
                        new Vector3(1, -1, -1),

                        new Vector3(-1, 1, -1),
                        new Vector3(-1, 1, 1),
                        new Vector3(1, 1, 1),
                        new Vector3(1, 1, -1),

                        new Vector3(-1, -1, -1),
                        new Vector3(1, -1, -1),
                        new Vector3(1, -1, 1),
                        new Vector3(-1, -1, 1),

                        new Vector3(1, -1, -1),
                        new Vector3(1, 1, -1),
                        new Vector3(1, 1, 1),
                        new Vector3(1, -1, 1),

                        new Vector3(-1, -1, -1),
                        new Vector3(-1, -1, 1),
                        new Vector3(-1, 1, 1),
                        new Vector3(-1, 1, -1)
                    ],
                    texcoord: [
                        new Vector2(0, 0),
                        new Vector2(1, 0),
                        new Vector2(1, 1),
                        new Vector2(0, 1),

                        new Vector2(0, 0),
                        new Vector2(1, 0),
                        new Vector2(1, 1),
                        new Vector2(0, 1),

                        new Vector2(0, 0),
                        new Vector2(1, 0),
                        new Vector2(1, 1),
                        new Vector2(0, 1),

                        new Vector2(0, 0),
                        new Vector2(1, 0),
                        new Vector2(1, 1),
                        new Vector2(0, 1),

                        new Vector2(0, 0),
                        new Vector2(1, 0),
                        new Vector2(1, 1),
                        new Vector2(0, 1),

                        new Vector2(0, 0),
                        new Vector2(1, 0),
                        new Vector2(1, 1),
                        new Vector2(0, 1),
                    ],
                    normal: [
                        new Vector3(0, 0, 1),
                        new Vector3(0, 0, 1),
                        new Vector3(0, 0, 1),
                        new Vector3(0, 0, 1),

                        new Vector3(0, 0, -1),
                        new Vector3(0, 0, -1),
                        new Vector3(0, 0, -1),
                        new Vector3(0, 0, -1),

                        new Vector3(0, 1, 0),
                        new Vector3(0, 1, 0),
                        new Vector3(0, 1, 0),
                        new Vector3(0, 1, 0),

                        new Vector3(0, -1, 0),
                        new Vector3(0, -1, 0),
                        new Vector3(0, -1, 0),
                        new Vector3(0, -1, 0),

                        new Vector3(1, 0, 0),
                        new Vector3(1, 0, 0),
                        new Vector3(1, 0, 0),
                        new Vector3(1, 0, 0),

                        new Vector3(-1, 0, 0),
                        new Vector3(-1, 0, 0),
                        new Vector3(-1, 0, 0),
                        new Vector3(-1, 0, 0),
                    ],
                    triangles: [
                        0,  1,  2,      0,  2,  3,
                        4,  5,  6,      4,  6,  7,
                        8,  9,  10,     8,  10, 11,
                        12, 13, 14,     12, 14, 15,
                        16, 17, 18,     16, 18, 19,
                        20, 21, 22,     20, 22, 23,
                    ],
                },
            },

        );
    }
}

export { Mesh, MeshGenerator };
