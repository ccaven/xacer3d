
/**
 * Import the minekhan engine
 */
import * as engine from "./minekhan-engine.js";

/**
 * Run the program
 * @param {Number} startTime - The initial time of the program
 */
function main (startTime) {

    engine.displayContext.setBackgroundColor(0.1, 0.5, 0.9);
    engine.displayContext.clear();

    let chunk = new engine.ChunkObject([0, 0]);

    console.log(chunk);

}

/**
 * Lets get this party started
 */
main();