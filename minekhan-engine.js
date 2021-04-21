/**
 * Import math libraries from gl-matrix
 */
import * as vec3 from "./src/gl-matrix/vec3.js";
import * as vec4 from "./src/gl-matrix/vec4.js";
import * as mat3 from "./src/gl-matrix/mat3.js";
import * as mat4 from "./src/gl-matrix/mat4.js";
import * as quat from "./src/gl-matrix/quat.js";

/**
 * Simplex noise by Jonas Wagner
 */
import {
    SimplexNoise
} from "./src/noise.js";

/**
 * Import the functionality to initialize the input device
 */
import {
    getInputObject
} from "./src/input.js";

/**
 * Import classes from the 3D library
 */
import {
    Camera,
    GameObject,
    StandardMesh,
    Transform
} from "./src/x3d.js";

/**
 * Import classes from the WebGL wrapper library
 */
import {
    DisplayContext,
    Renderer
} from "./src/xgl.js";

/**
 * Import classes from physics library
 */
import {
    PhysicsObject
} from "./src/physics.js";


/**
 * Create the display context
 */
export const displayContext = new DisplayContext({
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true,
    alpha: false
});

/**
 * Create the chunk renderer.
 * Used to draw solid chunks.
 */
export const chunkRenderer = new Renderer(displayContext, {
    vertex: await fetch("./shaders/minekhan/chunk-vertex.glsl").then(r => r.text()),
    fragment: await fetch("./shaders/minekhan/chunk-fragment.glsl").then(r => r.text())
});

/**
 * Initialize the input object
 */
export const input = getInputObject();

/**
 * The block data object represents the attributes of each block
 */
export const blockData = await fetch("./res/blockData.json").then(r => r.json());

/**
 * The entity data object represents the attributes of each entity
 */
export const entityData = await fetch("./res/entityData.json").then(r => r.json());

 /**
  * The width of each chunk, in voxels
  */
export const CHUNK_WIDTH = 16;

 /**
  * The height of the world, in voxels
  *
  * TODO:
  *  - Expand to 256 or even 512
  */
export const CHUNK_HEIGHT = 128;

/**
 * The Entity class
 * Stores all entities in the game
 * This includes players and mobs
 */
export class Entity extends PhysicsObject {

    constructor(transform, name) {
        super(transform, 1);

        this.name = name;
        this.id = entityData[name].id;

        this.health = entityData[name].health;
    }

}

/**
 * The player class
 * Stores the player object
 */
export class Player extends Entity {
    /**
     * Create a new Player object
     */
    constructor() {
        super(new Transform(), "player");

        this.camera = new Camera(displayContext);
        this.camera.setRenderer(chunkRenderer);

        // Link camera's transform to this.transform
        this.camera.transform = this.transform;
    }

    /**
     *
     */
    controls() {
        let movementSpeed = 0.1;

        let forwardX = Math.sin(this.camera.yaw);
        let forwardZ = Math.cos(this.camera.pitch);

        if (input.keys.w) {
            this.velocity[0] += forwardX * movementSpeed;
            this.velocity[2] += forwardZ * movementSpeed;
        }

        if (input.keys.s) {
            this.velocity[0] -= forwardX * movementSpeed;
            this.velocity[2] -= forwardZ * movementSpeed;
        }

        if (input.keys.a) {
            this.velocity[0] += forwardZ * movementSpeed;
            this.velocity[2] -= forwardX * movementSpeed;
        }

        if (input.keys.d) {
            this.velocity[0] -= forwardZ * movementSpeed;
            this.velocity[2] += forwardX * movementSpeed;
        }
    }
}

/**
 * Stores data for the world as a whole
 * Includes chunks, entities, and the environment
 *
 * TODO:
 *  - Day/night cycle
 *  - Weather?
 */
export class World {

    /**
     * Create a new World
     * @param {Number} seed - The unique identifier to dictate the generation of the world
     */
    constructor(seed) {
        this.seed = seed;
        this.chunks = [];
        this.chunkReference = {};

        this.noiseGenerator = new SimplexNoise(this.seed);
    }

    /**
     * Add a chunk to the loading queue
     * @param {Number} x
     * @param {Number} z
     */
    addChunk(x, z) {
        this.chunks.push(new ChunkObject([x, z]));
        this.chunkReference[x + "," + z] = this.chunks.length - 1;
    }

    /**
     * Retrieve a chunk object
     * @param {Number} x - The x index of the chunk
     * @param {Number} z - The z index of the chunk
     */
    getChunk(x, z) {
        let key = x + "," + z;
        let exists = this.chunkReference.hasOwnProperty(key);
        if (!exists) return;
        let index = this.chunkReference[key];
        return this.chunks[index];
    }

    /**
     * Get the voxel value in global coordinates
     * @param {Number} gx - The global x coordinate
     * @param {Number} gy - The global y coordinate
     * @param {Number} gz - The global z coordinate
     */
    getVoxel(gx, gy, gz) {
        let chunkX = Math.floor(gx / CHUNK_WIDTH);
        let chunkZ = Math.floor(gz / CHUNK_WIDTH);
        let chunk = this.getChunk(chunkX, chunkZ);
        if (chunk) return chunk.getVoxel(gx - chunkX * CHUNK_WIDTH, gy, gz - chunkZ * CHUNK_WIDTH);
    }
}

/**
 * Stores each chunk object
 *
 * TODO:
 *  - Write Mesh generation
 *  - Write lighting spreader
 */
export class ChunkObject extends GameObject {
    /**
     * Create a new Chunk object
     * @param {vec2} position
     */
    constructor(position) {
        const mesh = new StandardMesh(displayContext, [
            { name: "position", size: 3 },
            { name: "texcoord", size: 2 },
            { name: "normal", size: 3 }
        ]);

        const transform = new Transform(
            vec3.create(),
            quat.create(),
            vec3.create());

        super(chunkRenderer, mesh, transform);

        this.transform.position[0] = position[0] * CHUNK_WIDTH;
        this.transform.position[1] = -CHUNK_HEIGHT;
        this.transform.position[2] = position[1] * CHUNK_WIDTH;

        this.loaded = false;
        this.voxels = new Uint16Array(CHUNK_HEIGHT * CHUNK_WIDTH * CHUNK_WIDTH);
    }

    /**
     * Set the value of a voxel
     * @param {Number} x - The x coordinate within the chunk
     * @param {Number} y - The y coordinate within the chunk
     * @param {Number} z - The z coordinate within the chunk
     * @param {Number} value - The value to set the voxel to
     */
    setVoxel(x, y, z, value) {
        this.voxels[x + (y + z * CHUNK_WIDTH) * CHUNK_HEIGHT] = value;
    }

    /**
     * Get the value of a voxel
     * @param {Number} x - The x coordinate within the chunk
     * @param {Number} y - The y coordinate within the chunk
     * @param {Number} z - The z coordinate within the chunk
     * @returns {Number} The value of the voxel at that point
     */
    getVoxel(x, y, z) {
        return this.voxels[x + (y + z * CHUNK_WIDTH) * CHUNK_HEIGHT];
    }

    /**
     * Generate the voxel array given a map definition function
     * @param {(position: vec3) => Number} mapDefinition - Defines the value of a voxel given a position
     */
    fillVoxels(mapDefinition) {
        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_HEIGHT; y++) {
                for (let z = 0; z < CHUNK_WIDTH; z++) {
                    let gx = x + this.transform.position[0];
                    let gy = y + this.transform.position[1];
                    let gz = z + this.transform.position[2];
                    this.setVoxel(x, y, z, mapDefinition([gx, gy, gz]));
                }
            }
        }
    }

    /**
     * Generate the mesh around a single block
     * @param {Number} x - The local x coordinate
     * @param {Number} y - The local y coordinate
     * @param {Number} z - The local z coordinate
     */
    generateBlockMesh(x, y, z) {

        for (let i = 0; i < 6; i++) {

            let axis = i % 3;
            let side = i / 3 | 0;

            let curTri = this.mesh.data.position.length / 3;

            for (let j = 0; j < 4; j++) {


                let checkDir = [0, 0, 0];
                checkDir[axis] = side * 2 - 1;

                let globalCheckX = this.transform.position[0] + x + checkDir[0];
                let globalCheckY = this.transform.position[1] + y + checkDir[1];
                let globalCheckZ = this.transform.position[2] + z + checkDir[2];

                let voxel = world.getVoxel(globalCheckX, globalCheckY, globalCheckZ);

                if (!voxel || voxel.transparent) {
                    let newPositions = [
                        x, y, z,
                        x, y, z,
                        x, y, z,
                        x, y, z,
                    ];

                    // Set side that is constant
                    newPositions[0 + axis] = side;
                    newPositions[3 + axis] = side;
                    newPositions[6 + axis] = side;
                    newPositions[9 + axis] = side;

                    newPositions[0 + (axis + 1) % 3] += 0;
                    newPositions[0 + (axis + 2) % 3] += 0;

                    newPositions[3 + (axis + 1) % 3] += 1;
                    newPositions[3 + (axis + 2) % 3] += 0;

                    newPositions[6 + (axis + 1) % 3] += 1;
                    newPositions[6 + (axis + 2) % 3] += 1;

                    newPositions[9 + (axis + 1) % 3] += 0;
                    newPositions[9 + (axis + 2) % 3] += 1;


                    // TODO: Get texcoords on texture alias that go with the block
                    let newTexcoords = [
                        0, 0,
                        0, 1,
                        1, 1,
                        1, 0,
                    ];

                    // TODO: Set proper winding order
                    let newTris = [
                        curTri + 0, curTri + 1, curTri + 2,
                        curTri + 3, curTri + 2, curTri + 0
                    ];

                    let newNormals = [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0,
                    ];

                    newNormals[0 + axis] = side * 2 - 1;
                    newNormals[3 + axis] = side * 2 - 1;
                    newNormals[6 + axis] = side * 2 - 1;
                    newNormals[9 + axis] = side * 2 - 1;

                    this.mesh.data.position = this.mesh.data.position.concat(newPositions);
                    this.mesh.data.texcoord = this.mesh.data.texcoord.concat(newTexcoords);
                    this.mesh.data.normal = this.mesh.data.normal.concat(newNormals);
                    this.mesh.data.triangles = this.mesh.data.triangles.concat(newTris);
                }

            }

        }

    }

    /**
     * Generate the mesh of the chunk
     * For each voxel and for each face, determine if it has a neighbor
     * If not, draw a face there
     */
    generateMesh() {
        for (let x = 0; x < CHUNK_WIDTH; x++)
            for (let y = 0; y < CHUNK_HEIGHT; y++)
                for (let z = 0; z < CHUNK_WIDTH; z++)
                    if (this.getVoxel(x, y, z) > 0) this.generateBlockMesh(x, y, z);
        this.mesh.setBuffers();
    }
}
