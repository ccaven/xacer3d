/**
 * @module input
 */

/**
 * Create a new object with easily accessible mouse and key properties.
 * Make sure to run input.tick() at the end of each frame
 * @returns {{
 *  mouseX: Number,
 *  mouseY: Number,
 *  movementX: Number,
 *  movementY: Number,
 *  mousePressed: Boolean,
 *  keys: {key: Boolean},
 *  tick: Function
 * }}
 */
export function getInputObject () {
    let obj = {};

    obj.keys = {};

    obj.mouseX = 0;
    obj.mouseY = 0;

    obj.movementX = 0;
    obj.movementY = 0;

    obj.mousePressed = false;

    document.onmousemove = function (e) {
        obj.mouseX = e.x;
        obj.mouseY = e.y;

        obj.movementX = e.movementX;
        obj.movementY = e.movementY;
    };

    document.onmousedown = function (e) {
        obj.mousePressed = true;
    };

    document.onmouseup = function (e) {
        obj.mousePressed = false;
    };

    document.onkeydown = function (e) {
        obj.keys[e.key] = true;
    };

    document.onkeyup = function (e) {
        obj.keys[e.key] = false;
    };

    obj.tick = function () {
        this.movementX = 0;
        this.movementY = 0;
    };

    return obj;
}


