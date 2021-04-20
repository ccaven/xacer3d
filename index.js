

import * as vec3 from "./src/gl-matrix/vec3.js";
import * as vec4 from "./src/gl-matrix/vec4.js";
import * as mat3 from "./src/gl-matrix/mat3.js";
import * as mat4 from "./src/gl-matrix/mat4.js";
import * as quat from "./src/gl-matrix/quat.js";

import { SimplexNoise } from "./src/noise.js";

import { GameObject, StandardMesh, Transform } from "./src/x3d.js";
import { DisplayContext, Renderer } from "./src/xgl.js";

/**
 * The display context represents the WebGL rendering context
 * It consists of a canvas which is automatically attached to the document
 */
const displayContext = new DisplayContext({
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true,
    alpha: false
});

/**
 * The chunk renderer is responsible for drawing specific chunks
 *
 * TODO:
 *  - Create glass renderer that runs a separate pass
 *  - Create a water renderer that runs a separate pass
 */
const chunkRenderer = new Renderer(displayContext, {
    vertex: await fetch("./shaders/minekhan/chunk-vertex.glsl").then(r => r.text()),
    fragment: await fetch("./shaders/minekhan/chunk-fragment.glsl").then(r => r.text())
});

/**
 * The world seed determines how the world is generated
 * Two worlds with the same seed will be identical
 *
 * TODO:
 *  - Make world seed dependent on the world created
 */
const worldSeed = Math.random() * 65536;

/**
 * The noise generator is used to procedurally create terrain
 * It uses Simplex noise, which is faster than traditional Perlin noise
 */
const noiseGenerator = new SimplexNoise(worldSeed);

/**
 * The width of each chunk, in voxels
 */
const CHUNK_WIDTH = 16;

/**
 * The height of the world, in voxels
 *
 * TODO:
 *  - Expand to 256 or even 512
 */
const CHUNK_HEIGHT = 128;

/**
 * Stores data for the world as a whole
 * Includes chunks, entities, and the environment
 *
 * TODO:
 *  - Day/night cycle
 *  - Weather?
 */
const world = {
    /**
     * The array of chunks in the world
     * @type {ChunkObject[]}
     */
    chunks: [],

    /**
     * A reference array to get the index of a chunk from its position
     * @type {{String: Number}}
     */
    chunkReference: {},

    /**
     * Add a chunk to the loading queue
     * @param {Number} x
     * @param {Number} z
     */
    addChunk (x, z) {
        this.chunks.push(new ChunkObject([x, z]));
        this.chunkReference[x + "," + z] = this.chunks.length - 1;
    },

    /**
     * Retrieve a chunk object
     * @param {Number} x - The x index of the chunk
     * @param {Number} z - The z index of the chunk
     */
    getChunk (x, z) {
        let key = x + "," + z;
        let exists = this.chunkReference.hasOwnProperty(key);
        if (!exists) return;
        let index = this.chunkReference[key];
        return this.chunks[index];
    },

    /**
     * Get the voxel value in global coordinates
     * @param {Number} gx - The global x coordinate
     * @param {Number} gy - The global y coordinate
     * @param {Number} gz - The global z coordinate
     */
    getVoxel (gx, gy, gz) {
        let chunkX = Math.floor(gx / CHUNK_WIDTH);
        let chunkZ = Math.floor(gz / CHUNK_WIDTH);

        let chunk = this.getChunk(chunkX, chunkZ);

        if (chunk) return chunk.getVoxel(gx - chunkX * CHUNK_WIDTH, gy, gz - chunkZ * CHUNK_WIDTH);
    }
};

/**
 * Stores data for each block
 *
 * TODO:
 *  - Get specific IDs from Minecraft
 *  - Store IDs in specific file (not hardcoded), maybe JSON or something lower level
 */
const blockData = {
    0: {
        name: "air",
        transparent: true,
    },
    1: {
        name: "block",
    },
};

/**
 * Stores each chunk object
 *
 * TODO:
 *  - Write Mesh generation
 *  - Write lighting spreader
 */
class ChunkObject extends GameObject {
    /**
     * Create a new Chunk object
     * @param {vec2} position
     */
    constructor (position) {
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
    setVoxel (x, y, z, value) {
        this.voxels[x + (y + z * CHUNK_WIDTH) * CHUNK_HEIGHT] = value;
    }

    /**
     * Get the value of a voxel
     * @param {Number} x - The x coordinate within the chunk
     * @param {Number} y - The y coordinate within the chunk
     * @param {Number} z - The z coordinate within the chunk
     * @returns {Number} The value of the voxel at that point
     */
    getVoxel (x, y, z) {
        return this.voxels[x + (y + z * CHUNK_WIDTH) * CHUNK_HEIGHT];
    }

    /**
     * Generate the voxel array given a map definition function
     * @param {(position: vec3) => Number} mapDefinition - Defines the value of a voxel given a position
     */
    fillVoxels (mapDefinition) {
        for (let x = 0; x < CHUNK_WIDTH; x ++) {
            for (let y = 0; y < CHUNK_HEIGHT; y ++) {
                for (let z = 0; z < CHUNK_WIDTH; z ++) {
                    let gx = x + this.transform.position[0];
                    let gy = y + this.transform.position[1];
                    let gz = z + this.transform.position[2];
                    this.setVoxel(x, y, z, mapDefinition([gx, gy, gz]));
                }
            }
        }
    }

    generateBlockMesh (x, y, z) {

        let positions = this.mesh.data.position;
        let texcoord = this.mesh.data.texcoord;
        let normal = this.mesh.data.normal;
        let triangles = this.mesh.data.triangles;



    }

    /**
     * Generate the mesh of the chunk
     * For each voxel and for each face, determine if it has a neighbor
     * If not, draw a face there
     */
    generateMesh () {
        for (let x = 0; x < CHUNK_WIDTH; x ++)
            for (let y = 0; y < CHUNK_HEIGHT; y ++)
                for (let z = 0; z < CHUNK_WIDTH; z ++)
                    if (this.getVoxel(x, y, z) > 0) this.generateBlockMesh(x, y, z);
        this.mesh.setBuffers();
    }
}

/**
 * Run the program
 * @param {Number} startTime - The initial time of the program
 */
function main (startTime) {

    let chunk = new ChunkObject([0, 0]);

    chunk.fillVoxels((x, y, z) => {
        let noiseValue = noiseGenerator.noise3D(x / 10, y / 10, z / 10);
        return noiseValue > 0 ? 1 : 0;
    });

    chunk.generateMesh();


    console.log(chunk.voxels);

}

/**
 * Lets get this party started
 */
requestAnimationFrame(main);