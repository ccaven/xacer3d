/**
 * @module x3d
 */

import * as glMatrix from "./gl-matrix/common.js";
import * as vec3 from "./gl-matrix/vec3.js";
import * as vec4 from "./gl-matrix/vec4.js";
import * as mat3 from "./gl-matrix/mat3.js";
import * as mat4 from "./gl-matrix/mat4.js";
import * as quat from "./gl-matrix/quat.js";

import * as xgl from "./xgl.js";

/**
 * @class
 * Represents the position, rotation, and scale of an object
 */
export class Transform {
    /**
     * Create a new Transform object
     * @param {ReadonlyVec3} position - The position of the center of the object
     * @param {ReadonlyQuat} rotation - The rotation of the object
     * @param {ReadonlyVec3} scale - The scale of the object along the x, y, and z axis
     */
    constructor (position, rotation, scale) {
        this.position = position || vec3.create();
        this.rotation = rotation || quat.create();
        this.scale = scale || vec3.create();

        this.model = mat4.create();
    }

    /**
     * Generate the model matrix for this specific transform
     */
    generateModel () {
        mat4.fromRotationTranslation(this.model, this.rotation, this.position);
    }
}

/**
 * @class
 * Represents a viewport into the 3D scene
 */
export class Camera {
    /**
     * Create a new Camera element
     * @param {xgl.DisplayContext} displayContext - The WebGL instance wrapper
     */
    constructor (displayContext) {
        this.transform = new Transform();

        this.renderer = null;

        this.parent = displayContext;
        this.aspect = this.parent.aspect;

        this.fovy = Math.PI / 2;
        this.near = 0.1;
        this.far = 100.0;

        this.pitch = 0.0;
        this.yaw = 0.0;

        this.projection = mat4.create();
    }

    /**
     * Generate the perspective matrix of the camera
     */
    generateProjection () {
        mat4.perspective(this.projection, this.fovy, this.aspect, this.near, this.far);
        mat4.rotate(this.projection, this.projection, this.pitch, [1, 0, 0]);
        mat4.rotate(this.projection, this.projection, this.yaw, [0, 1, 0]);
        mat4.translate(this.projection, this.projection, this.transform.position);

        if (this.renderer) this.renderer.setUniform("u_projection", this.projection);
    }

    /**
     * Set which renderer the camera uses
     * @param {xgl.Renderer} renderer - The new renderer to use
     */
    setRenderer (renderer) {
        if (!renderer.gl) console.error("Invalid renderer!");
        this.renderer = renderer;
    }
}

/**
 * @class
 * Stores the base mesh class
 */
export class StandardMesh {

    /**
     * Create a new Mesh
     * @param {xgl.DisplayContext} context - The display context
     * @param {{name: String, size: Number}[]} buffers - The list of buffers the mesh uses
     */
    constructor(context, buffers) {
        this.gl = context.gl;

        this.vertexArray = this.gl.createVertexArray();

        this.bufferData = buffers;

        this.buffers = {};
        this.data = {
            triangles: []
        };

        for (let i = 0; i < this.bufferData.length; i ++) {
            let bufferName = this.bufferData[i].name;
            this.data[bufferName] = [];
            this.buffers[bufferName] = this.gl.createBuffer();
        }

        this.triangleBuffer = this.gl.createBuffer();
    }

    /**
     * Send the data to the WebGL buffers
     * @param {Number} mode - Static or dynamic draw
     */
    setBuffers (mode=this.gl.STATIC_DRAW) {
        this.gl.bindVertexArray(this.vertexArray);
        for (let i = 0; i < this.bufferData.length; i ++) {
            let name = this.bufferData[i].name;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.data[name]), mode);
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data.triangles), mode);
    }

    /**
     * Point the WebGL buffers to the attributes of a renderer
     * @param {xgl.Renderer} renderer
     */
    setAttibPointers (renderer) {
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.useProgram(renderer.program);

        for (let i = 0; i < this.bufferData.length; i ++) {
            let name = this.bufferData[i].name;
            let size = this.bufferData[i].size;

            let attribName = "a_" + name;
            let attribLoc = renderer.locations[attribName];

            this.gl.enableVertexAttribArray(attribLoc);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
            this.gl.vertexAttribPointer(attribLoc, size, this.gl.FLOAT, false, 0, 0);
        }
    }

    /**
     * Render the mesh
     * @param {xgl.Renderer} renderer - The renderer to display the mesh with
     */
    render (renderer) {
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.useProgram(renderer.program);
        this.gl.drawElements(this.gl.TRIANGLES, this.data.triangles.length, this.gl.UNSIGNED_SHORT, 0);
    }
}

/**
 * @class
 * Stores a game object
 */
export class GameObject {
    /**
     * Create a new GameObject
     * @param {StandardMesh} mesh
     * @param {Transform} transform
     * @param {xgl.Renderer} renderer;
     */
    constructor(renderer, mesh, transform) {
        this.mesh = mesh;
        this.transform = transform;
        this.renderer = renderer;

        this.mesh.setAttibPointers(this.renderer);
    }

    /**
     * Draw the Game Object
     */
    render() {
        this.transform.generateModel();
        this.renderer.setUniform("u_model", this.transform.model);
        this.mesh.render(renderer);
    }
}