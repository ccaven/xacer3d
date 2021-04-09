
console.log("Starting program");

import { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 } from "./src/math.js";
import { Mesh } from "./src/geometry.js";
import { DisplayContext, Renderer, PixelRenderer } from "./src/webgl.js";

const displayContext = new DisplayContext();

const renderer = new Renderer(displayContext, await fetch("./shaders/terrain.glsl").then(r => r.text()));



// console.log(displayContext);
