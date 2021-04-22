/**
 * @module physics
 */

/**
 * Import classes from 3d library
 */
import { Transform } from "./x3d.js";

/**
 * Import math libraries from gl-matrix
 */
 import * as vec3 from "./gl-matrix/vec3.js";
 import * as vec4 from "./gl-matrix/vec4.js";
 import * as mat3 from "./gl-matrix/mat3.js";
 import * as mat4 from "./gl-matrix/mat4.js";
 import * as quat from "./gl-matrix/quat.js";

/**
 * The physics object class represents all objects impacted by physics.
 * This includes all entities such as the player, as well as falling blocks such as loose sand or ignited TNT.
 * Usually this class is extended to create new physics objects.
 */
export class PhysicsObject {

    /**
     * Create a new Physics object
     * @param {Transform} transform - The location and orientation of the object
     * @param {Number} mass - The mass of the object
     */
    constructor (transform, mass) {

        this.transform = transform;
        this.mass = mass;

        this.velocity = vec3.create();
        this.acceleration = vec3.create();
    }

    /**
     * Move the PhysicsObject's position and velocity accordingly
     * @param {Number} deltaTime - The delta time of the frame
     */
    integrate (deltaTime) {
        this.transform.position[0] += this.velocity[0] * deltaTime;
        this.transform.position[1] += this.velocity[1] * deltaTime;
        this.transform.position[2] += this.velocity[2] * deltaTime;

        this.velocity[0] += this.acceleration[0] * deltaTime;
        this.velocity[1] += this.acceleration[1] * deltaTime;
        this.velocity[2] += this.acceleration[2] * deltaTime;

        this.acceleration[0] = 0;
        this.acceleration[1] = 0;
        this.acceleration[2] = 0;
    }

    /**
     * Apply a force to the physics object
     * @param {vec3} force - The force to apply
     */
    applyForce (force) {
        this.acceleration[0] += force[0] / this.mass;
        this.acceleration[1] += force[1] / this.mass;
        this.acceleration[2] += force[2] / this.mass;
    }
}


