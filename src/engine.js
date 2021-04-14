
import { Vector3, Matrix4 } from "./math.js";

class GameObject {

    /**
     *
     * @param {Mesh} mesh
     * @param {Vector3} position
     * @param {Vector3} rotation
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
        this.model.identity().translate(this.position);
    }

}
