
import { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 } from "./math.js";

/**
 * Stores the WebGL context
 */
class DisplayContext {

    /**
     * Create a new DisplayContext instance
     */
    constructor () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

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

        this.gl = this.canvas.getContext("webgl2");

        if (!this.gl) {
            throw new Error("WebGL2 not supported!");
        }

        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clearColor(1.0, 0.5, 0.5, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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
        const vertexSrc = shaderSource.split("// FRAGMENT SHADER")[0].trim();
        const fragmentSrc = shaderSource.split("// FRAGMENT SHADER")[1].trim();

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
}

class Renderer {

    /**
     * Create a Renderer instance
     * @param {DisplayContext} displayContext
     * @param {String} shaderFilename
     */
    constructor (displayContext, shaderSource) {

        this.context = displayContext;
        this.gl = displayContext.gl;

        this.program = displayContext.createProgram(shaderSource);

        console.log(this.program);

        const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        const numAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);

        this.locations = {};
        this.types = {};
        this.sizes = {};

        for (let i = 0; i < numUniforms; i ++) {
            const info = this.gl.getActiveUniform(this.program, i);

            console.log(`New uniform ${info.name} with type ${info.type} and size ${info.size}`);

            this.locations[info.name] = this.gl.getUniformLocation(this.program, info.name);
            this.types[info.name] = info.type;
            this.sizes[info.name] = info.size;
        }

        for (let i = 0; i < numAttributes; i ++) {
            const info = this.gl.getActiveAttrib(this.program, i);

            console.log(`New attribute ${info.name} with type ${info.type} and size ${info.size}`);

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

class PixelRenderer {}

export { DisplayContext, Renderer, PixelRenderer };

