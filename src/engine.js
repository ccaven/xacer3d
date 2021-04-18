
import { Vector3, Matrix4, Quat } from "./math.js";
import { Renderer } from "./webgl.js";
import { Mesh } from "./geometry.js";

class GameObject {

    /**
     *
     * @param {Mesh} mesh
     * @param {Vector3} position
     * @param {Quat} rotation
     * @param {Vector3} scale
     */
    constructor (mesh, position, rotation, scale) {
        this.mesh = mesh;

        this.position = position;

        this.rotation = rotation;

        this.scale = scale;

        this.model = new Matrix4();
    }

    calculateModel () {
        return this.model.identity().rotateQuat(this.rotation.get().invert()).scale(this.scale).translate(this.position);
    }

    render (renderer) {
        this.mesh.setAttribPointers(renderer);
        //renderer.setUniform("u_model", this.calculateModel());
        this.mesh.render(renderer);
    }

}

class Camera {

    /**
     * Create a new Camera element
     * @param {Renderer} renderer - The parent renderer
     * @param {Vector3} position - The position of the camera
     * @param {*} configuration - Extra arguments
     */
    constructor(renderer, position, configuration) {
        this.renderer = renderer;

        this.position = position;

        this.pitch = configuration.pitch || 0.0;
        this.yaw = configuration.yaw || 0.0;

        this.nearPlane = configuration.near || 0.1;
        this.farPlane = configuration.far || 100.0;

        this.aspect = this.renderer.context.aspect;
        this.fov = configuration.fov || Math.PI / 2;

        this.matrix = new Matrix4();
    }

    /**
     * Build and set the camera's projection matrix
     */
    setMatrix () {
        this.matrix.identity().perspective(this.fov, this.aspect, this.nearPlane, this.farPlane).rotateX(this.pitch).rotateY(this.yaw).translate(this.position);
        this.renderer.setUniform("u_projection", this.matrix);
    }

}

export { DisplayContext, Renderer, PixelRenderer } from "./webgl.js";
export { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4, Quat } from "./math.js";
export { Mesh, MeshGenerator } from "./geometry.js";
export { GameObject, Camera };