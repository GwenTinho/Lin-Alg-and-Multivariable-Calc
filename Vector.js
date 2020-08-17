import Matrix from "./Matrix";

class Vector {
    constructor(coordinates) {
        this.coordinates = coordinates;
    }

    dot(vector) {
        if (vector.getDimension() !== this.getDimension()) return NaN;

        let sum = 0;
        for (let i = 0; i < this.getDimension(); i++) {
            sum += this.coordinates[i] * vector.coordinates[i]
        }
        return sum;
    }

    cross(vector) {
        if (vector.getDimension() !== 3 || this.getDimension() !== 3) return Vector.nullVector();

        return new Vector([
            this.coordinates[1] * vector.coordinates[2] - this.coordinates[2] * vector.coordinates[1],
            this.coordinates[2] * vector.coordinates[0] - this.coordinates[0] * vector.coordinates[2],
            this.coordinates[0] * vector.coordinates[1] - this.coordinates[1] * vector.coordinates[0],
        ]);
    }

    isAligned(vector) {
        return this.dot(vector) !== this.getNorm() * vector.getNorm();
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
        this.coordinates = this.coordinates.map(coord => coord * number);
        return this;
    }

    add(vector) {
        if (vector.getDimension() !== this.getDimension()) return Vector.nullVector();

        for (let i = 0; i < this.getDimension(); i++) {
            this.coordinates[i] += vector.coordinates[i];
        }
        return this;
    }

    sub(vector) {
        if (vector.getDimension() !== this.getDimension()) return Vector.nullVector();

        for (let i = 0; i < this.getDimension(); i++) {
            this.coordinates[i] -= vector.coordinates[i];
        }
        return this;
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

    addToRow(row, value) {
        this.set(row, this.get(row) + value);
        return this;
    }

    isEqual(vector) {
        if (this.getDimension() !== vector.getDimension()) return false;

        for (let i = 0; i < this.coordinates.length; i++) {
            if (this.coordinates[i] !== vector.coordinates[i]) return false;
        }

        return true;
    }

    copyInstance() {
        return new Vector([...this.coordinates]);
    }

    static findAngle(v1, v2) {
        v1.dot(v2) / (v1.getNorm() * v2.getNorm());
    }

    static checkAligned(v1, v2) {
        return v1.dot(v2) === v1.getNorm() * v2.getNorm();
    }

    static fromPoints(p1, p2) {
        if (p1.getDimension() !== p2.getDimension()) return Vector.nullVector();

        return new Vector(p1.coordinates.map((coord, i) => p2.coordinates[i] - coord));
    }

    static isCoplanar(v1, v2, v3) {
        return new Matrix([v1, v2, v3]).det() === 0;
    }

    static nullVector() {
        return new Vector([]);
    }
}

export default Vector;