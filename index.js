import { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 } from "./src/math.js";
import { Mesh, MeshGenerator } from "./src/geometry.js";
import { DisplayContext, Renderer, PixelRenderer } from "./src/webgl.js";

const displayContext = new DisplayContext({
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true
});

const renderer = new Renderer(displayContext, {
    vertex: await fetch("./shaders/terrain-vertex.glsl").then(r => r.text()),
    fragment: await fetch("./shaders/terrain-fragment.glsl").then(r => r.text())
});

const proj = new Matrix4().perspective(90, displayContext.aspect, 0, 10);

const meshCreator = new MeshGenerator(displayContext,
    /* Mesh data here */
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
                0, 1, 2,
                3, 2, 0
            ],
        },
    },

);



const mesh = meshCreator.meshes.quad;

renderer.setUniform("u_projection", proj);

displayContext.setBackgroundColor(0.0, 0.0, 0.0);
displayContext.clear();

mesh.setAttribPointers(renderer);
mesh.render(renderer);

