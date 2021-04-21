/**
 * @module time
 */

/**
 * The time class tracks the delta time per frame
 */
export class Time {
    /**
     * Initialize the time object
     */
    constructor() {
        this.currentTime = performance.now();
        this.deltaTime = 0;
        this.fps = 60;
    }

    /**
     * Update the current time and delta time
     */
    update () {
        let newTime = performance.now();
        this.deltaTime = (newTime - this.currentTime) * 0.001;
        this.fps = 1 / this.deltaTime;
        this.currentTime = newTime;
    }
}
