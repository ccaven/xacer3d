# xacer3d
WebGL-based 3D rendering pipeline.

NOTE: This is very incomplete - was mainly a side project so I could write raytracers without the WebGL boilerplate.

Use at your own risk.

## Submodules
 - math: Vector and Matrix libraries
 - geometry: Mesh libraries
 - webgl: WebGL shader-based renderer library

## Example
```js
// main.js
let displayContext = new DisplayContext();

let geometryShader = new Shader(displayContext, "./shaders/geometry.glsl");
let geometryRenderer = new Renderer(displayContext, geometryShader);

let cubeMesh = Mesh.fromPrimitive(Mesh.CUBE);

cubeMesh.renderWith(geometryRenderer);
```

## Download
Coming soon to `npm`!
