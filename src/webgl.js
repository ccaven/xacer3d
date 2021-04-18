/**
 * @module webgl.js
 */

import { Mesh } from "./geometry.js";

/**
 * Stores the WebGL context
 */
class DisplayContext {

    /**
     * Create a new DisplayContext instance
     */
    constructor (args) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;

        /**
         * The canvas
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.createElement("canvas");

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";

        document.body.style.margin = "0px";
        document.body.style.padding = "0px";
        document.body.style.overflow = "hidden";

        document.body.append(this.canvas);

        this.gl = this.canvas.getContext("webgl2", args);

        if (!this.gl) {
            throw new Error("WebGL2 not supported!");
        }

        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clearColor(1.0, 0.5, 0.5, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
    }

    /**
     * Create a WebGL shader
     * @param {Number} type - The type of shader
     * @param {String} source - The shader code
     * @returns {WebGLShader}
     */
    createShader (type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

        if (success) return shader;

        console.error(this.gl.getShaderInfoLog(shader));

        this.gl.deleteShader(shader);
    }

    /**
     * Create a WebGL program
     * @param {String} shaderFilename - The shader to create the program based off
     * @returns {WebGLProgram}
     */
    createProgram (shaderSource) {
        const vertexSrc = shaderSource.vertex;
        const fragmentSrc = shaderSource.fragment;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSrc);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSrc);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

        if (success) return program;

        console.error(this.gl.getProgramInfoLog(program));

        this.gl.deleteProgram(program);
    }

    /**
     * Set the render target to the canvas
     */
    renderToScreen () {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    /**
     * Set the background color
     * @param {Number} r - The red component of the color
     * @param {Number} g - The green component of the color
     * @param {Number} b - The blue component of the color
     */
    setBackgroundColor (r, g, b) {
        this.gl.clearColor(r, g, b, 1);
    }

    clear () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}

/**
 * Stores a WebGL Program object with extra functionality
 */
class Renderer {

    /**
     * Create a Renderer instance
     * @param {DisplayContext} displayContext
     * @param {Object} shaderSource
     */
    constructor (displayContext, shaderSource) {

        this.context = displayContext;
        this.gl = displayContext.gl;

        this.program = displayContext.createProgram(shaderSource);

        const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        const numAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);

        this.locations = {};
        this.types = {};
        this.sizes = {};

        for (let i = 0; i < numUniforms; i ++) {
            const info = this.gl.getActiveUniform(this.program, i);

            //console.log(`New uniform ${info.name} with type ${info.type} and size ${info.size}`);

            this.locations[info.name] = this.gl.getUniformLocation(this.program, info.name);
            this.types[info.name] = info.type;
            this.sizes[info.name] = info.size;
        }

        for (let i = 0; i < numAttributes; i ++) {
            const info = this.gl.getActiveAttrib(this.program, i);

            //console.log(`New attribute ${info.name} with type ${info.type} and size ${info.size}`);

            this.locations[info.name] = this.gl.getAttribLocation(this.program, info.name);
            this.types[info.name] = info.type;
            this.sizes[info.name] = info.size;
        }
    }

    /**
     * Set the shader uniform
     * @param {String} name - The name of the uniform
     * @param  {Object} values - The value you want to set
     */
    setUniform (name, value) {

        this.gl.useProgram(this.program);

        let location = this.locations[name];

        if (!location) return;

        let type = this.types[name];

        //let type = this.types[name];
        switch (value.constructor.name) {
            case "Number":
                if (type == this.gl.FLOAT) this.gl.uniform1f(location, value);
                else if (type == this.gl.INT) this.gl.uniform1i(location, value);
                else console.error(`Unknown input type: ${value.constructor.name}!`);
                break;
            case "Vector2":
                this.gl.uniform2f(location, value.x, value.y);
                break;
            case "Vector3":
                this.gl.uniform3f(location, value.x, value.y, value.z);
                break;
            case "Vector4":
                this.gl.uniform4f(location, value.x, value.y, value.z, value.w);
                break;
            case "Matrix2":
                this.gl.uniformMatrix2fv(location, false, value.toArray());
                break;
            case "Matrix3":
                this.gl.uniformMatrix3fv(location, false, value.toArray());
                break;
            case "Matrix4":
                this.gl.uniformMatrix4fv(location, false, value.toArray());
                break;
            default:
                console.error(`Unknown input type: ${value.constructor.name}!`);
        }

    }

}

class RenderTexture {
    /**
     *
     * @param {DisplayContext} displayContext - The display context
     * @param {Number} width - The width of the texture
     * @param {Number} height - The height of the texture
     */
    constructor (displayContext, width, height) {
        this.gl = displayContext.gl;
        this.width = width;
        this.height = height;

        this.framebuffer = this.gl.createFramebuffer();

        this.colorTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

        this.depthTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

        this.gl.bindFramebuffer(this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.colorTexture, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture, 0);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    /**
     * Tell WebGL to render to this texture
     */
    setRenderTarget () {
        this.gl.bindFramebuffer(this.framebuffer);
    }
}

/**
 * Stores a renderer made for drawing textures
 */
class PixelRenderer extends Renderer {
    /**
     * Create a new PixelRenderer object
     * @param {DisplayContext} displayContext - The display context
     * @param {Object} shaderSource - An object containing the vertex and fragment shaders
     * @param {Number} width - The width of the texture
     * @param {Number} height - The height of the texture
     */
    constructor(displayContext, shaderSource, width=displayContext.width, height=displayContext.height) {
        super(displayContext, shaderSource);

        this.texture = new RenderTexture(width, height);
        this.mesh = new Mesh(displayContext,
            { name: "position", size: 2 });

        this.mesh.setData("position", new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]));
        this.mesh.setData("triangles", new Uint16Array([0, 1, 2, 0, 2, 3]));

        this.mesh.setBuffers();
        this.mesh.setAttribPointers(this);
    }

    /**
     * Render the PixelRenderer
     */
    render () {
        this.mesh.render(this);
    }
}

export { DisplayContext, Renderer, PixelRenderer };

