import { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 } from "./src/math.js";
import { Mesh } from "./src/geometry.js";
import { DisplayContext, Renderer, PixelRenderer } from "./src/webgl.js";

const displayContext = new DisplayContext({
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true
});

const renderer = new Renderer(displayContext, {
    vertex: await fetch("./shaders/terrain-vertex.glsl").then(r => r.text()),
    fragment: await fetch("./shaders/terrain-fragment.glsl").then(r => r.text())
});

const mesh = new Mesh(displayContext,
    { name: "position", size: 3 },
    { name: "texcoord", size: 2 },
    { name: "normal", size: 3 });

mesh.setData("position", new Float32Array([
    -1, -1, 1,
    1, -1, 1,
    1, 1, 1,
    -1, 1, 1
]));

mesh.setData("texcoord", new Float32Array([
    0, 0,
    0, 1,
    1, 1,
    1, 0
]));

mesh.setData("normal", new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
]));

mesh.setData("triangles", new Uint16Array([
    0, 1, 2,
    2, 3, 0
]));

const proj = new Matrix4().perspective(90, displayContext.aspect, 0, 10);

renderer.setUniform("u_projection", proj);

mesh.setBuffers();
mesh.setAttribPointers(renderer);

displayContext.setBackgroundColor(0.0, 0.0, 0.0);
displayContext.clear();

mesh.render(renderer);
