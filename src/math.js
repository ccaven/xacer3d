
/**
 * @module math.js
 *
 */

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

    static fromVector3 (that) {
        return new Vector4(that.x, that.y, that.z, 1.0);
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

    toArray () {
        return new Float32Array([
            this.axis[0].x, this.axis[1].x,
            this.axis[0].y, this.axis[1].y
        ]);
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
        m.setAxis(0, new Vector3(values[0], values[3], values[6]));
        m.setAxis(1, new Vector3(values[1], values[4], values[7]));
        m.setAxis(2, new Vector3(values[2], values[5], values[8]));
        return m;
    }

    mul (that) {
        this.axis[0].transform(that);
        this.axis[1].transform(that);
        this.axis[2].transform(that);
    }

    toArray () {
        return new Float32Array([
            this.axis[0].x, this.axis[1].x, this.axis[2].x,
            this.axis[0].y, this.axis[1].y, this.axis[2].y,
            this.axis[0].z, this.axis[1].z, this.axis[2].z,
        ]);
    }
}

/**
 * Stores a 4x4 matrix
 */
class Matrix4 {
    /**
     * Create an identity Matrix4 object
     */
    constructor () {
        /**
         * @type {Vector4[]}
         */
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
     * @returns {Matrix4} reference to original
     */
    mul (that) {
        this.axis[0].transform(that);
        this.axis[1].transform(that);
        this.axis[2].transform(that);
        this.axis[3].transform(that);
        return this;
    }

    /**
     * Create a perspective projection matrix
     * @param {Number} fov - Field of view
     * @param {Number} near - The near plane
     * @param {Number} far - The far plane
     * @returns {Matrix4} reference to original object
     */
    perspective (fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy / 2);

        let v10 = far != null && far != Infinity ? (far + near) / (near - far) : -1;
        let v14 = far != null && far != Infinity ? (2 * far * near) / (near - far) : -2 * near;

        this.axis[0].set(f / aspect, 0, 0, 0);
        this.axis[1].set(0, f, 0, 0);
        this.axis[2].set(0, 0, v10, 0);
        this.axis[3].set(0, 0, v14, 1);

        return this;
    }

    /**
     * convert the matrix to an array
     * @returns {Float32Array} the array of values
     */
    toArray () {
        return new Float32Array([
            this.axis[0].x, this.axis[1].x, this.axis[2].x, this.axis[3].x,
            this.axis[0].y, this.axis[1].y, this.axis[2].y, this.axis[3].y,
            this.axis[0].z, this.axis[1].z, this.axis[2].z, this.axis[3].z,
            this.axis[0].w, this.axis[1].w, this.axis[2].w, this.axis[3].w,
        ]);
    }

    /**
     * Translate the 4x4 matrix
     * @param {Vector3} that - The vector to translate by
     * @returns {Matrix4} reference to original object
     */
    translate (that) {
        this.axis[3].x += that.x;
        this.axis[3].y += that.y;
        this.axis[3].z += that.z;
        return this;
    }

    /**
     * Rotate the matrix around the X axis
     * @param {Number} theta - The angle to rotate by
     * @returns {Matrix4} reference to original object
     */
    rotateX (theta) {
        let ct = Math.cos(theta);
        let st = Math.sin(theta);

        const matrixToRotateBy = new Matrix4();
        matrixToRotateBy.axis[1].y = ct;
        matrixToRotateBy.axis[1].z = st;
        matrixToRotateBy.axis[2].y = -st;
        matrixToRotateBy.axis[2].z = ct;

        return this.mul(matrixToRotateBy);
    }

    /**
     * Rotate the matrix around the Z axis
     * @param {Number} theta - The angle to rotate by
     * @returns {Matrix4} reference to original object
     */
    rotateY (theta) {
        let ct = Math.cos(theta);
        let st = Math.sin(theta);

        const matrixToRotateBy = new Matrix4();
        matrixToRotateBy.axis[0].x = ct;
        matrixToRotateBy.axis[0].y = st;
        matrixToRotateBy.axis[2].x = -st;
        matrixToRotateBy.axis[2].y = ct;

        return this.mul(matrixToRotateBy);
    }

    /**
     * Rotate the matrix around the Z axis
     * @param {Number} theta - The angle to rotate by
     * @returns {Matrix4} reference to original object
     */
    rotateZ (theta) {
        let ct = Math.cos(theta);
        let st = Math.sin(theta);

        const matrixToRotateBy = new Matrix4();
        matrixToRotateBy.axis[0].x = ct;
        matrixToRotateBy.axis[0].y = st;
        matrixToRotateBy.axis[1].x = -st;
        matrixToRotateBy.axis[1].y = ct;

        return this.mul(matrixToRotateBy);
    }

    /**
     * Rotate based on a quaternion
     * @param {Quat} quat - The quaternion based on the rotation
     */
    rotateQuat (quat) {
        return this.mul(quat.toMatrix());
    }

    /**
     * Set a matrix to the identity matrix
     * @returns {Matrix4} reference to original object
     */
    identity () {
        this.axis[0].mul(0);
        this.axis[1].mul(0);
        this.axis[2].mul(0);
        this.axis[3].mul(0);

        this.axis[0].x = 1;
        this.axis[1].y = 1;
        this.axis[2].z = 1;
        this.axis[3].w = 1;

        return this;
    }

    /**
     * Scale a matrix
     * @param {Vector3} factor - The amount to scale by
     * @returns {Matrix4} reference to original
     */
    scale (factor) {
        this.axis[0].x *= factor.x;
        this.axis[1].y *= factor.y;
        this.axis[2].z *= factor.z;
        return this;
    }

    /**
     * Create a matrix4 from a matrix3
     * @param {Matrix3} that - The 3x3 matrix
     */
    static fromMatrix3 (that) {
        var m = new Matrix4();

        m.axis[0].setVec(Vector4.fromVector3(that.axis[0]));
        m.axis[1].setVec(Vector4.fromVector3(that.axis[1]));
        m.axis[2].setVec(Vector4.fromVector3(that.axis[2]));

        return m;
    }
}

/**
 * Stores a rotation in 3D space
 */
class Quat {

    /**
     * Create a new quaternion
     * @param {Number} r - The real part
     * @param {Number} i - The first imaginary part
     * @param {Number} j - The second imaginary part
     * @param {Number} k - The third imaginary part
     */
    constructor (r=0, i=0, j=0, k=1) {
        this.r = r;
        this.i = i;
        this.j = j;
        this.k = k;
    }

    /**
     * Transform a quaternion into a unit quaternion
     * @returns {Quat} reference to original
     */
    identity () {
        this.r = 0;
        this.i = 0;
        this.j = 0;
        this.k = 1;
        return this;
    }

    /**
     * Set the quaternion to a rotation around an axis
     * @param {Vector3} axis - The axis to rotate on
     * @param {Number} angle - How many radians to rotate by
     * @returns {Quat} reference to original
     */
    axisAngle (axis, angle) {
        angle *= 0.5;
        let s = Math.sin(angle);
        this.r = s * axis.x;
        this.i = s * axis.y;
        this.j = s * axis.z;
        this.k = Math.cos(angle);
        return this;
    }

    /**
     * Get the axis of rotation of a quaternion
     * @returns {Vector3} the axis
     */
    getAxis () {
        let rad = Math.acos(this.k) * 2.0;
        let s = Math.sin(rad / 2.0);
        if (s > Number.EPSILON) {
            return new Vector3(this.r / s, this.i / s, this.j / s);
        }
        return new Vector3(1, 0, 0);
    }

    /**
     * Calculate the number of radians between two quaternions
     * @param {Quat} that - The other quaternion
     * @returns {Number} the number of radians
     */
    angleBetween (that) {
        let dp = this.dot(that);
        return Math.acos(2.0 * dp * dp - 1);
    }

    /**
     * Compute the dot product with another quaternion
     * @param {Quat} that - The other quaternion
     * @returns {Number} the dot product
     */
    dot (that) {
        return this.r * that.r + this.i * that.i + this.j * that.j + this.k * that.k;
    }

    /**
     * Multiply two quaternions
     * @param {Quat} that - The other quaternion
     * @returns {Quat} reference to original
     */
    mul (that) {
        let ax = this.r,
            ay = this.i,
            az = this.j,
            aw = this.k;
        let bx = that.r,
            by = that.i,
            bz = that.j,
            bw = that.k;
        this.r = ax * bw + aw * bx + ay * bz - az * by;
        this.i = ay * bw + aw * by + az * bx - ax * bz;
        this.j = az * bw + aw * bz + ax * by - ay * bx;
        this.k = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }

    /**
     * Rotate the quaternion about the x axis
     * @param {Number} angle
     * @returns {Quat} reference to original
     */
    rotateX (angle) {
        angle *= 0.5;
        let ax = this.r, ay = this.i, az = this.j, aw = this.k;
        let bx = Math.sin(angle), bw = Math.cos(rad);

        this.r = ax * bw + aw * bx;
        this.i = ay * bw + az * bx;
        this.j = az * bw - ay * bx;
        this.k = aw * bw - ax * bx;

        return this;
    }

    /**
     * Rotate the quaternion about the y axis
     * @param {Number} angle
     * @returns {Quat} reference to original
     */
    rotateY (angle) {
        angle *= 0.5;
        let ax = this.r, ay = this.i, az = this.j, aw = this.k;
        let by = Math.sin(angle), bw = Math.cos(rad);

        this.r = ax * bw - az * by;
        this.i = ay * bw + aw * by;
        this.j = az * bw + ax * by;
        this.k = aw * bw - ay * by;

        return this;
    }

    /**
     * Rotate the quaternion about the z axis
     * @param {Number} angle
     * @returns {Quat} reference to original
     */
    rotateZ (angle) {
        angle *= 0.5;
        let ax = this.r, ay = this.i, az = this.j, aw = this.k;
        let bz = Math.sin(angle), bw = Math.cos(rad);

        this.r = ax * bw + ay * bz;
        this.i = ay * bw - ax * bz;
        this.j = az * bw + aw * bz;
        this.k = aw * bw - az * bz;

        return this;
    }

    /**
     * Compute the W component of the quaternion so it is normalized
     * @returns {Quat} reference to original
     */
    calculateW () {
        let x = this.r, y = this.i, z = this.j;
        this.w = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
        return this;
    }

    /**
     * Compute the value of e^q
     * @returns {Quat} reference to original
     */
    exp () {
        let x = this.r,
            y = this.i,
            z = this.j,
            w = this.k;
        let r = Math.sqrt(x * x + y * y + z * z);
        let et = Math.exp(w);
        let s = r > 0 ? (et * Math.sin(r)) / r : 0;

        this.r = x * s;
        this.i = y * s;
        this.j = z * s;
        this.k = et * Math.cos(r);
        return this;
    }

    /**
     * Compute the value of ln(q)
     * @returns {Quat} reference to original
     */
    ln () {
        let x = this.r,
            y = this.i,
            z = this.j,
            w = this.k;
        let r = Math.sqrt(x * x + y * y + z * z);
        let t = r > 0 ? Math.atan2(r, w) / r : 0;

        this.r = x * t;
        this.i = y * t;
        this.j = z * t;
        this.k = 0.5 * Math.log(x * x + y * y + z * z + w * w);
        return this;
    }

    /**
     * Raise the quaternion to a power
     * @param {Number} b - The power to raise it by
     * @returns {Quat} reference to original
     */
    pow (b) {
        return this.get().ln().scale(b).exp();
    }

    /**
     * Scale the quaternion by a factor
     * @param {Number} factor - The factor to scale it by
     * @returns {Quat} reference to original object
     */
    scale (factor) {
        this.r *= factor;
        this.i *= factor;
        this.j *= factor;
        this.k *= factor;
        return this;
    }

    /**
     * Create a clone of the quaternion
     * @returns {Quat} clone of the object
     */
    get () {
        return new Quat(this.r, this.i, this.j, this.k);
    }

    /**
     * Spherically interpolate two quaternions
     * @param {Quaternion} that - The other quaternion
     * @param {Number} t - The interpolation factor
     * @returns {Quat} reference to original
     */
    slerp (that, t) {
        let ax = this.r,
            ay = this.i,
            az = this.j,
            aw = this.k;
        let bx = that.r,
            by = that.i,
            bz = that.j,
            bw = that.k;
        let omega, cosom, sinom, scale0, scale1;
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        if (1.0 - cosom > Number.EPSILON) {
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        } else {
            scale0 = 1.0 - t;
            scale1 = t;
        }
        return new Quat(scale0 * ax + scale1 * bx, scale0 * ay + scale1 * by, scale0 * az + scale1 * bz, scale0 * aw + scale1 * bw);
    }

    /**
     * Generate a random unit quaternion
     * @returns {Quat} reference to original
     */
    random () {
        let u1 = Math.random();
        let u2 = Math.random();
        let u3 = Math.random();

        let sqrt1MinusU1 = Math.sqrt(1 - u1);
        let sqrtU1 = Math.sqrt(u1);
        return new Quat(
            sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2),
            sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2),
            sqrtU1 * Math.sin(2.0 * Math.PI * u3),
            sqrtU1 * Math.cos(2.0 * Math.PI * u3));
    }

    /**
     * Calculate the inverse of a quaternion
     * @returns {Quat} reference to original
     */
    invert () {
        let a0 = this.r,
            a1 = this.i,
            a2 = this.j,
            a3 = this.k;
        let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        let invDot = dot ? 1.0 / dot : 0;
        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
        this.r = -a0 * invDot;
        this.i = -a1 * invDot;
        this.j = -a2 * invDot;
        this.k = a3 * invDot;
        return this;
    }

    /**
     * Calculate the conjugate of a quaternion
     * @returns {Quat} reference to original
     */
    conjugate () {
        this.r = -this.r;
        this.i = -this.i;
        this.j = -this.j;
        return this;
    }

    /**
     * Calculate a quaternion based on euler angles
     * @param {Vector3} eulerAngles - A vector representing the euler angles
     * @returns {Quat} reference to original
     */
    fromEuler (eulerAngles) {
        let x = eulerAngles.x,
            y = eulerAngles.y,
            z = eulerAngles.z;
        let halfToRad = (0.5 * Math.PI) / 180.0;
            x *= halfToRad;
            y *= halfToRad;
            z *= halfToRad;
        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);
        this.r = sx * cy * cz - cx * sy * sz;
        this.i = cx * sy * cz + sx * cy * sz;
        this.j = cx * cy * sz - sx * sy * cz;
        this.k = cx * cy * cz + sx * sy * sz;
        return this;
    }

    /**
     * Calculate a quaternion based on euler angles
     * @param {Number} x - The rotation around the x axis
     * @param {Number} y - The rotation around the y axis
     * @param {Number} z - The rotation around the z axis
     * @returns {Quat} reference to original
     */
    fromEuler2 (x, y, z) {
        let halfToRad = (0.5 * Math.PI) / 180.0;
            x *= halfToRad;
            y *= halfToRad;
            z *= halfToRad;
        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);
        this.r = sx * cy * cz - cx * sy * sz;
        this.i = cx * sy * cz + sx * cy * sz;
        this.j = cx * cy * sz - sx * sy * cz;
        this.k = cx * cy * cz + sx * sy * sz;
        return this;
    }

    /**
     * Convert the quaternion to a matrix
     * @returns {Matrix4} the rotation matrix
     */
    toMatrix () {
        let m = new Matrix4();
        let s = 1 / this.dot(this);
        m.axis[0].x = 1 - 2 * s * (this.j * this.j + this.k * this.k);
        m.axis[0].y = 2 * s * (this.i * this.j + this.k * this.r);
        m.axis[0].z = 2 * s * (this.i * this.k - this.j * this.r);

        m.axis[1].x = 2 * s * (this.i * this.j - this.k * this.r);
        m.axis[1].y = 1 - 2 * s * (this.i * this.i + this.k * this.k);
        m.axis[1].z = 2 * s * (this.j * this.k + this.i * this.r);

        m.axis[2].x = 2 * s * (this.i * this.k + this.j * this.r);
        m.axis[2].y = 2 * s * (this.j * this.k - this.i * this.r);
        m.axis[2].z = 1 - 2 * s * (this.i * this.i + this.j * this.j);

        return m;
    }
}

export { Vector2, Vector3, Vector4, Matrix2, Matrix3, Matrix4, Quat };