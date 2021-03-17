import Matrix from "./Matrix";

class Vector {
    constructor(coordinates) {
        this.coordinates = coordinates;
    }

    dot(vector) {
        if (!vector) throw new Error("vector is falsy");
        if (vector.getDimension() !== this.getDimension()) throw new Error("Cannot dot vectors with different dimensions: A: " + this.getDimension() + ", B: " + vector.getDimension());

        let sum = 0;
        for (let i = 0; i < this.getDimension(); i++) {
            sum += this.coordinates[i] * vector.coordinates[i]
        }
        return sum;
    }

    cross(vector) {
        if (vector.getDimension() !== 3 || this.getDimension() !== 3) throw new Error("Cannot cross vectors with different dimensions: A: " + this.getDimension() + ", B: " + vector.getDimension());

        return new Vector([
            this.coordinates[1] * vector.coordinates[2] - this.coordinates[2] * vector.coordinates[1],
            this.coordinates[2] * vector.coordinates[0] - this.coordinates[0] * vector.coordinates[2],
            this.coordinates[0] * vector.coordinates[1] - this.coordinates[1] * vector.coordinates[0],
        ]);
    }

    isAligned(vector) {
        return this.dot(vector) !== this.getNorm() * vector.getNorm();
    }

    isZero() {
        for (let i = 0; i < this.getDimension(); i++) {
            if (this.get(i) !== 0) {
                return false;
            }
        }
        return true
    }

    getDimension() {
        return this.coordinates.length;
    }

    getNormSquared() {
        let sum = 0;
        for (let i = 0; i < this.getDimension(); i++) {
            sum += this.coordinates[i] * this.coordinates[i];
        }
        return sum;
    }

    getNorm() {
        return Math.sqrt(this.getNormSquared());
    }

    asUnit() {
        return this.mult(1 / this.getNorm());
    }

    mult(number) {
        this.coordinates = this.coordinates.map(coord => coord * number); // check where this mess appears and think how to fix it to be immutable
        return this;
    }

    add(vector) {
        if (vector.getDimension() !== this.getDimension()) throw new Error("Cannot add vectors with different dimensions: A: " + this.getDimension() + ", B: " + vector.getDimension());

        for (let i = 0; i < this.getDimension(); i++) {
            this.coordinates[i] += vector.coordinates[i];
        }
        return this;
    }

    sub(vector) {
        if (vector.getDimension() !== this.getDimension()) throw new Error("Cannot substract vectors with different dimensions: A: " + this.getDimension() + ", B: " + vector.getDimension());

        for (let i = 0; i < this.getDimension(); i++) {
            this.coordinates[i] -= vector.coordinates[i];
        }
        return this;
    }

    /**
     * When using this function you must be able to guarantee that this = k * vector
     * @param {Vector} vector
     * @returns a multiplier of this = k * vector
     */
    findMultiplier(vector) {
        for (let i = 0; i < this.getDimension(); i++) {
            if (this.get(i) !== 0) {
                return this.get(i) / vector.get(i);
            }
        }
        throw new Error("Cannot compare zero vector");
    }

    negate(row) {
        this.coordinates[row] = -this.coordinates[row];
    }

    set(row, value) {
        this.coordinates[row] = value;
    }

    get(row) {
        return this.coordinates[row];
    }

    getCoordinates() {
        return this.copyInstance().coordinates;
    }

    addToRow(row, value) {
        this.set(row, this.get(row) + value);
        return this;
    }

    /**
     * Returns true if the absolute difference between each entry is within the maxError
     *
     * @param {Vector} vector vector that we compare against
     * @param {number} maxError maximum margin of error
     */
    isEqual(vector, maxError = 1e-6) {
        if (this.getDimension() !== vector.getDimension()) return false;

        for (let i = 0; i < this.coordinates.length; i++) {
            if (Math.abs(this.coordinates[i] - vector.coordinates[i]) > maxError) return false;
        }

        return true;
    }

    isEmpty() {
        return this.coordinates.length === 0;
    }

    copyInstance() {
        return new Vector([...this.coordinates]);
    }

    toString() {
        if (this.isEmpty()) return "[]";

        let word = "[ ";
        for (let i = 0; i < this.getDimension(); i++) {
            word = word + ((i !== 0) ? ", " : "") + this.get(i);
        }
        word += " ]";

        return word;
    }

    static findAngle(v1, v2) {
        v1.dot(v2) / (v1.getNorm() * v2.getNorm());
    }

    static checkAligned(v1, v2) {
        return v1.dot(v2) === v1.getNorm() * v2.getNorm();
    }

    static fromPoints(p1, p2) {
        if (p1.getDimension() !== p2.getDimension()) throw new Error("Cannot generate vectors from points with different dimensions: A: " + this.getDimension() + ", B: " + vector.getDimension());

        return new Vector(p1.coordinates.map((coord, i) => p2.coordinates[i] - coord));
    }

    static isCoplanar(v1, v2, v3) {
        return new Matrix([v1, v2, v3]).det() === 0;
    }

    static nullVector() {
        return new Vector([]);
    }

    /**
     * @param {Number} n
     * @returns {Vector} a vector with random coordinates between 0 and 10 (both included)
     */
    static randomVector(n) {
        const coords = [];

        for (let index = 0; index < n; index++) {
            coords.push(Math.floor(Math.random() * 11));
        }
        return new Vector(coords);
    }

    static zero(n) {
        return new Vector(new Array(n).fill(0));
    }
}

export default Vector;
