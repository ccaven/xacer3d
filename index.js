
import * as mat4 from "./src/gl-matrix/mat4.js";
import { StandardMesh } from "./src/x3d.js";
import { DisplayContext, Renderer } from "./src/xgl.js";

const displayContext = new DisplayContext({
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true,
    alpha: false
});

const renderer = new Renderer(displayContext, {
    vertex: await fetch("./shaders/standard/standard-vertex.glsl").then(r=>r.text()),
    fragment: await fetch("./shaders/standard/standard-fragment.glsl").then(r=>r.text())
});

displayContext.setBackgroundColor(0.4, 0.1, 1.0);
displayContext.clear();

const mesh = new StandardMesh(displayContext, [
    { name: "position", size: 3 },
    { name: "texcoord", size: 2 }
]);

mesh.data.position = [
    -1, -1, 0,
    -1, 1, 0,
    1, 1, 0,
    1, -1, 0
];

mesh.data.texcoords = [
    0, 0,
    0, 1,
    1, 1,
    1, 0
];

mesh.data.triangles = [
    0, 2, 1,
    3, 2, 0
];

renderer.setUniform("u_projection", mat4.create());
renderer.setUniform("u_model", mat4.create());

mesh.setBuffers();
mesh.setAttibPointers(renderer);
mesh.render(renderer);
