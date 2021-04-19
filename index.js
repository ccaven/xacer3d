

import * as vec3 from "./src/gl-matrix/vec3.js";
import * as vec4 from "./src/gl-matrix/vec4.js";
import * as mat3 from "./src/gl-matrix/mat3.js";
import * as mat4 from "./src/gl-matrix/mat4.js";
import * as quat from "./src/gl-matrix/quat.js";

import { StandardMesh } from "./src/x3d.js";
import { DisplayContext, Renderer } from "./src/xgl.js";

const displayContext = new DisplayContext({
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true,
    alpha: false
});

const renderer = new Renderer(displayContext, {
    vertex: await fetch("./shaders/postprocessing/pixelshader-vertex.glsl").then(r=>r.text()),
    fragment: await fetch("./shaders/raytracing/cavan-challenge.glsl").then(r=>r.text())
});

displayContext.setBackgroundColor(0.4, 0.1, 1.0);
displayContext.clear();

const mesh = new StandardMesh(displayContext, [
    { name: "position", size: 2 },
]);

mesh.data.position = [
    -1, -1,
    -1, 1,
    1, 1,
    1, -1,
];

mesh.data.triangles = [
    0, 2, 1,
    3, 2, 0
];

const camera = vec3.create();
camera[2] = -5;

renderer.setUniform("u_resolution", [displayContext.width, displayContext.height])
renderer.setUniform("u_camera", camera);
renderer.setUniform("u_view", mat3.create())

mesh.setBuffers();
mesh.setAttibPointers(renderer);
mesh.render(renderer);

console.log(mesh);
