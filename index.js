import {
    Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4, Quat,
    Mesh, MeshGenerator,
    DisplayContext, Renderer, PixelRenderer,
    GameObject, Camera
} from "./src/engine.js";

const displayContext = new DisplayContext({
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: true
});

const renderer = new Renderer(displayContext, {
    vertex: await fetch("./shaders/terrain-vertex.glsl").then(r => r.text()),
    fragment: await fetch("./shaders/terrain-fragment.glsl").then(r => r.text())
});

const cam = new Camera(renderer, new Vector3(0.0, 0, 0), {
    near: 0.0,
    far: 20.0,
    pitch: 0.0,
    yaw: 0.0
});

const meshCreator = MeshGenerator.getStandard(displayContext);

const gameObject = new GameObject(meshCreator.meshes.quad,
    new Vector3(0, 0, 0),
    new Quat(1, 0, 0, 0),
    new Vector3(1, 1, 1));

displayContext.setBackgroundColor(0.1, 0.1, 0.1);

function render (now) {

    cam.setMatrix();

    displayContext.clear();

    gameObject.render(renderer);

    requestAnimationFrame(render);

}

requestAnimationFrame(render);