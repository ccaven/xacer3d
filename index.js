
/**
 * Import the minekhan engine
 */
import * as mat4 from "./src/gl-matrix/mat4.js";
import * as engine from "./minekhan-engine.js";
import { StandardMesh } from "./src/x3d.js";
import { Renderer } from "./src/xgl.js";


engine.displayContext.setBackgroundColor(0.1, 0.5, 0.9);
engine.displayContext.clear();

let player = new engine.Player();

let renderer = new Renderer(engine.displayContext, {
    vertex: await fetch("./shaders/standard/standard-vertex.glsl").then(r => r.text()),
    fragment: await fetch("./shaders/standard/standard-fragment.glsl").then(r => r.text())
});

renderer.setUniform("u_model", mat4.create());

let mesh = new StandardMesh(engine.displayContext, [
    { name: "position", size: 3 },
    { name: "texcoord", size: 2 },
    { name: "normal", size: 3 }
]);

mesh.data.position = [
    -1, -1, -2.5,
    -1, 1, -2.5,
    1, 1, -2.5,
    1, -1, -2.5
];

mesh.data.texcoord = [
    0, 0,
    0, 1,
    1, 1,
    1, 0
];

mesh.data.normal = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
];

mesh.data.triangles = [
    0, 2, 1,
    3, 2, 0
];

mesh.setBuffers();
mesh.setAttibPointers(renderer);

player.camera.setRenderer(renderer);

function render () {

    let t = engine.time.currentTime;

    let r = Math.cos(t * 0.001) * 0.5 + 0.5;
    let g = Math.cos(t * 0.001 + Math.PI * 2 / 3) * 0.5 + 0.5;
    let b = Math.cos(t * 0.001 + Math.PI * 4 / 3) * 0.5 + 0.5;

    // engine.displayContext.setBackgroundColor(r, g, b);
    engine.displayContext.clear();

    engine.time.update();
    engine.input.tick();

    // player.transform.position[0] = Math.cos(t * 0.001);
    // player.camera.pitch = Math.sin(t * 0.002) * 0.1;

    player.controls();

    player.camera.pitch += engine.input.movementY * 0.01;
    player.camera.yaw += engine.input.movementX * 0.01;

    player.camera.generateProjection();

    mesh.render(renderer);

    requestAnimationFrame(render);
}

/**
 * Lets get this party started
 */

requestAnimationFrame(render);