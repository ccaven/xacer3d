
/**
 * Stores a two dimensional vector
 */
class Vector2 {
    /**
     * Create a new vector
     * @param {Number} x - The x component
     * @param {Number} y - The y component
     */
    constructor (x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Set the x and y values of a vector
     * @param {Number} x - The x component
     * @param {Number} y - The y component
     * @returns {Vector2} reference to original vector
     */
    set (x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Set the vector to another vector
     * @param {Vector2} that - The vector to be set to
     * @returns {Vector2} reference to original vector
     */
    setVec (that) {
        this.x = that.x;
        this.y = that.y;
        return this;
    }

    /**
     * Add a vector to another vector
     * @param {Vector2} that - The vector to add
     * @returns {Vector2} reference to original vector
     */
    add (that) {
        this.x += that.x;
        this.y += that.y;
        return this;
    }

    /**
     * Add a value to each of the components
     * @param {Number} that - The value to add
     * @returns {Vector2} reference to original vector
     */
    addScalar (that) {
        this.x += that;
        this.y += that;
        return this;
    }

    /**
     * Add a scaled version of a vector to another vector
     * @param {Vector2} that - The vector to add
     * @param {Number} factor - The factor to multiply by
     * @returns {Vector2} reference to original vector
     */
    addScaled (that, factor) {
        this.x += that.x * factor;
        this.y += that.y * factor;
        return this;
    }

    /**
     * Add a vector to another vector
     * @param {Vector2} that - The vector to add
     * @returns {Vector2} reference to original vector
     */
    sub (that) {
        this.x -= that.x;
        this.y -= that.y;
        return this;
    }

    /**
     * Scale the vector
     * @param {Number} that - The factor to multiply by
     * @returns {Vector2} reference to original vector
     */
    mul (that) {
        this.x *= that;
        this.y *= that;
        return this;
    }

    /**
     * Scale the vector with a vector
     * @param {Vector2} that - The vector to scale by
     * @returns {Vector2} reference to original vector
     */
    mulVec (that) {
        this.x *= that.x;
        this.y *= that.y;
        return this;
    }

    /**
     * Scale the vector with a vector
     * @param {Vector2} that - The vector to divide by
     * @returns {Vector2} reference to original vector
     */
    divVec (that) {
        this.x /= that.x;
        this.y /= that.y;
        return this;
    }

    /**
     * Rotate the vector
     * @param {Number} angle - The angle to rotate
     * @returns {Vector2} reference to original vector
     */
    rotate (angle) {
        var ct = Math.cos(angle), st = Math.sin(angle);
        var x = this.x, y = this.y;
        this.x = x * ct - y * st;
        this.y = x * st + y * ct;
        return this;
    }

    /**
     * Reflect the vector across a normal
     * @param {Vector2} normal - The normal
     * @param {Boolean} elastic - Whether to compute elastic collisions or inelastic
     * @returns
     */
    reflect (normal, elastic=1) {
        return normal.get()
            .mul(-(elastic+1) * normal.dot(this))
            .add(this);
    }

    /**
     * Clone a vector
     * @returns {Vector2} identical vector
     */
    get () {
        return new Vector2(this.x, this.y);
    }

    /**
     * Calculate the length of a vector
     * @returns {Number} the length
     */
    length () {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Calculate the dot product between two vectors
     * @param {Vector} that
     * @returns {Number} the dot product
     */
    dot (that) {
        return this.x * that.x + this.y * that.y;
    }

    /**
     * Convert the vector to a string
     * @returns {String} string version
     */
    toString () {
        return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}]`;
    }

    /**
     * Normalize the vector
     * @returns {Vector2} reference to original vector
     */
    normalize () {
        let l = this.length();
        this.mul(1 / l);
        return this;
    }

    /**
     * Calculate the distance to another vector
     * @param {Vector2} that - The other vector
     * @returns {Number} length between the two vectors
     */
    distanceTo (that) {
        let dx = this.x - that.x;
        let dy = this.y - that.y;
        return Math.hypot(dx, dy);
    }
}

/**
 * Stores a three dimensional vector
 */
class Vector3 {
    /**
     * Stores a three dimensional vector
     * @param {Number} x - The x component
     * @param {Number} y - The y component
     * @param {Number} z - The z component
     */
    constructor (x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    /**
     * Set the values of a vector
     * @param {Number} x - The x component
     * @param {Number} y - The y component
     * @param {Number} z The z component
     * @returns {Vector3} reference to original vector
     */
    set (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Set the values of a vector
     * @param {Vector3} - The vector to set it to
     * @returns {Vector3} reference to original vector
     */
    setVec (that) {
        this.x = that.x;
        this.y = that.y;
        this.z = that.z;
        return this;
    }

    /**
     * Create a clone of the vector
     * @returns {Vector3} a clone of the vector
     */
    get () {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Add a vector to this vector
     * @param {Vector3} that
     * @returns {Vector3} reference to original object
     */
    add (that) {
        this.x += that.x;
        this.y += that.y;
        this.z += that.z;
        return this;
    }

    /**
     * Add a scaled version of the vector
     * @param {Vector3} that - The vector
     * @param {Number} factor - The scale factor
     * @returns {Vector3} reference to original object
     */
    addScaled (that, factor) {
        this.x += that.x * factor;
        this.y += that.y * factor;
        this.z += that.z * factor;
        return this;
    }

    /**
     * Add a vector to this vector
     * @param {Vector3} that
     * @returns {Vector3} reference to original object
     */
    sub (that) {
        this.x += that.x;
        this.y += that.y;
        this.z += that.z;
        return this;
    }

    /**
     * Multiply the vector by a scalar
     * @param {Number} that
     * @returns {Vector3} reference to original object
     */
    mul (that) {
        this.x *= that;
        this.y *= that;
        this.z *= that;
        return this;
    }

    /**
     * Multiply a vector's values by another vector
     * @param {Vector3} that - The other vector
     * @returns {Vector3} reference to original object
     */
    mulVec (that) {
        this.x *= that.x;
        this.y *= that.y;
        this.z *= that.z;
        return this;
    }

    /**
     * Compute the dot product
     * @param {Vector3} that - The other vector
     * @returns {Number} the dot product
     */
    dot (that) {
        return this.x * that.x + this.y * that.y + this.z * that.z;
    }

    /**
     * Normalize a vector
     * @returns {Vector3} reference to original object
     */
    normalize () {
        return this.mul(1 / this.length());
    }

    /**
     * Compute the length of the vector
     * @returns {Number} the length
     */
    length () {
        return Math.hypot(this.x, this.y, this.z);
    }

    /**
     * Compute the cross product
     * @param {Vector3} that - The other vector
     * @returns {Vector3} reference to original object
     */
    cross (that) {
        var x = this.x, y = this.y, z = this.z;
        this.x = x * that.z - z * that.y;
        this.y = z * that.x - x * that.z;
        this.z = x * that.y - y * that.x;
        return this;
    }

    /**
     * Transform the vector based on a 3x3 matrix
     * @param {Matrix3} that - The matrix
     * @returns {Vector3} reference to the original object
     */
    transform (that) {
        console.log(that.axis[0].get().mul(this.x));
        let v = new Vector3()
            .addScaled(that.axis[0], this.x)
            .addScaled(that.axis[1], this.y)
            .addScaled(that.axis[2], this.z);
        return this.setVec(v);
    }
}

/**
 * Stores a four dimensional vector
 */
class Vector4 {
    /**
     * Create a four dimensional vector
     * @param {Number} x - The x component
     * @param {Number} y - The y component
     * @param {Number} z - The z component
     * @param {Number} w - The w component
     */
    constructor (x=0, y=0, z=0, w=1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Create a clone of a vector
     * @returns {Vector4} reference to the original object
     */
    get () {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    /**
     * Set the vector's values
     * @param {Number} x - The x component
     * @param {Number} y - The y component
     * @param {Number} z - The z component
     * @param {Number} w - The w component
     * @returns {Vector4} reference to the original object
     */
    set (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }

    /**
     * Set the vector's values
     * @param {Vector4} that
     * @returns {Vector4} reference to the original object
     */
    setVec (that) {
        this.x = that.x;
        this.y = that.y;
        this.z = that.z;
        this.w = that.w;
        return this;
    }

    /**
     * Add a vector
     * @param {Vector4} that - The other vector
     * @returns {Vector4} reference to original object
     */
     add (that) {
        this.x += that.x;
        this.y += that.y;
        this.z += that.z;
        this.w += that.w;
        return this;
    }

    /**
     * Add a scaled version of a vector
     * @param {Vector4} that - The vector to add
     * @param {Number} factor - The factor to multiply by
     * @returns {Vector4} reference to original object
     */
    addScaled (that, factor) {
        this.x += that.x * factor;
        this.y += that.y * factor;
        this.z += that.z * factor;
        this.w += that.w * factor;
        return this;
    }

    /**
     * Subtract a vector
     * @param {Vector4} that - The other vector
     * @returns {Vector4} reference to original object
     */
    sub (that) {
        this.x -= that.x;
        this.y -= that.y;
        this.z -= that.z;
        this.w -= that.w;
        return this;
    }

    /**
     * Scale a vector
     * @param {Number} that - The scale factor
     * @returns {Vector4} reference to original object
     */
    mul (that) {
        this.x *= that;
        this.y *= that;
        this.z *= that;
        this.w *= that;
        return this;
    }

    /**
     * Multiply a vector's values by another vector
     * @param {Vector4} that - The other vector
     * @returns {Vector4} reference to original object
     */
    mulVec (that) {
        this.x *= that.x;
        this.y *= that.y;
        this.z *= that.z;
        this.w *= that.w;
        return this;
    }

    /**
     * Compute the dot product between two vectors
     * @param {Vectot4} that - The other vector
     * @returns {Number} The dot product
     */
    dot (that) {
        return this.x * that.x + this.y * that.y + this.z * that.z + this.w * that.w;
    }

    /**
     * Normalize a vector
     * @returns {Vector4} reference to original object
     */
    normalize () {
        return this.mul(1 / this.length());
    }

    /**
     * Compute the length of a vector
     * @returns {Number} the length
     */
    length () {
        return Math.hypot(this.x, this.y, this.z, this.w);
    }

    /**
     * Transform the vector based on a matrix
     * @param {Matrix4} that - The matrix to multiply by
     * @returns {Vector4} reference to original vector
     */
    transform (that) {
        let v = new Vector4()
            .addScaled(that.axis[0], this.x)
            .addScaled(that.axis[1], this.y)
            .addScaled(that.axis[2], this.z)
            .addScaled(that.axis[3], this.w);
        return this.setVec(v);
    }
}

/**
 * Stores a 2x2 matrix
 */
class Matrix2 {
    /**
     * Construct a new identity matrix
     */
    constructor () {
        /**
         * @type {Vector2[]}
         */
        this.axis = [
            new Vector2(1, 0),
            new Vector2(0, 1)
        ];
    }

    /**
     * Set the axis of the matrix
     * @param {Number} index - Which axis to change
     * @param {Vector2} value - The new axis
     * @returns {Matrix2} reference to original object
     */
    setAxis (index, value) {
        this.axis[index].setVec(value);
        return this;
    }

    /**
     * Multiply with another matrix
     * @param {Matrix2} that - The other matrix to multiply by
     * @returns {Matrix2} reference to original object
     */
    mul (that) {
        this.axis[0].transform(that);
        this.axis[1].transform(that);
        return this;
    }

    /**
     * Create a new matrix from a set of values
     * @param  {...Number} values - The list of numbers
     * @returns {Matrix2} the matrix object
     */
    static fromValues (...values) {
        const m = new Matrix2();
        m.setAxis(0, new Vector2(values[0], values[1]));
        m.setAxis(0, new Vector2(values[2], values[3]));
        return m;
    }
}

/**
 * Stores a 3x3 matrix
 */
class Matrix3 {
    constructor () {
        this.axis = [
            new Vector3(1, 0, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 0, 1)
        ];
    }

    setAxis (index, value) {
        this.axis[index].setVec(value);
        return this;
    }

    /**
     * Create a matrix from values
     * @param  {...Number} values - The values that represent the matrix
     * @returns {Matrix3} the calculated matrix
     */
    static fromValues (...values) {
        const m = new Matrix3();
        m.setAxis(0, new Vector3(values[0], values[1], values[2]));
        m.setAxis(1, new Vector3(values[3], values[4], values[5]));
        m.setAxis(2, new Vector3(values[6], values[7], values[8]));
        return m;
    }

    mul (that) {
        this.axis[0].transform(that);
        this.axis[1].transform(that);
        this.axis[2].transform(that);
    }
}

/**
 * Stores a 4x4 matrix
 */
class Matrix4 {
    constructor () {
        this.axis = [
            new Vector4(1, 0, 0, 0),
            new Vector4(0, 1, 0, 0),
            new Vector4(0, 0, 1, 0),
            new Vector4(0, 0, 0, 1)
        ];
    }

    /**
     * Multiply this matrix by another matrix
     * @param {Matrix4} that
     */
    mul (that) {
        this.axis[0].transform(that);
        this.axis[1].transform(that);
        this.axis[2].transform(that);
        this.axis[3].transform(that);
    }
}

export { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4 };