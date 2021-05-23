import { BigFloat } from "../BigFloat";
import { Complex } from "../Complex";

export class Vector {
    constructor(private coordinates: Complex[]) { }

    static fromStrings(col: string) {
        return new Vector(col.split(" ").map(Complex.fromString));
    }

    dot(vector: Vector) {
        if (!vector) throw new Error("vector is falsy");
        if (vector.dimensions() !== this.dimensions()) throw new Error("Cannot dot vectors with different dimensions: A: " + this.dimensions() + ", B: " + vector.dimensions());

        let sum = Complex.ZERO;
        for (let i = 0; i < this.dimensions(); i++) {
            sum = sum.add(this.coordinates[i].mul(vector.coordinates[i].compl()))
        }
        return sum;
    }

    cross(vector: Vector) {
        if (vector.dimensions() !== 3 || this.dimensions() !== 3) throw new Error("Cannot cross vectors with different dimensions: A: " + this.dimensions() + ", B: " + vector.dimensions());

        return new Vector([
            this.coordinates[1].mul(vector.coordinates[2]).sub(this.coordinates[2].mul(vector.coordinates[1])),
            this.coordinates[2].mul(vector.coordinates[0]).sub(this.coordinates[0].mul(vector.coordinates[2])),
            this.coordinates[0].mul(vector.coordinates[1]).sub(this.coordinates[1].mul(vector.coordinates[0])),
        ]);
    }

    isAligned(vector: Vector) {
        return this.dot(vector).equals(Complex.fromReal(this.norm().mul(vector.norm())));
    }

    isZero(precision = BigFloat.ZERO) {
        return this.norm().isZero(precision);
    }

    dimensions() {
        return this.coordinates.length;
    }

    sqrNorm() {
        let sum = BigFloat.ZERO;
        for (let i = 0; i < this.dimensions(); i++) {
            sum = sum.add(this.coordinates[i].sqrMag());
        }
        return sum;
    }

    norm() {
        return this.sqrNorm().sqrt();
    }

    compl() {
        return new Vector(this.coordinates.map(coord => coord.compl()));
    }

    asUnit() {
        const norm = this.norm();
        if (norm.isZero()) throw new Error("Cannot normalize Zero vector");
        return this.divReal(norm);
    }

    divReal(number: BigFloat) {
        if (number.isZero()) throw new Error("Cannot divide by Zero");
        return new Vector(this.coordinates.map(coord => coord.divReal(number)));
    }

    div(number: Complex) {
        if (number.isZero()) throw new Error("Cannot divide by Zero");
        return new Vector(this.coordinates.map(coord => coord.div(number)));
    }

    mulReal(number: BigFloat) {
        return new Vector(this.coordinates.map(coord => coord.mulReal(number)));
    }

    mul(number: Complex) {
        return new Vector(this.coordinates.map(coord => coord.mul(number)));
    }

    add(vector: Vector) {
        if (vector.dimensions() !== this.dimensions()) throw new Error("Cannot add vectors with different dimensions: A: " + this.dimensions() + ", B: " + vector.dimensions());
        return new Vector(this.coordinates.map((coord, i) => coord.add(vector.coordinates[i])));
    }

    sub(vector: Vector) {
        if (vector.dimensions() !== this.dimensions()) throw new Error("Cannot substract vectors with different dimensions: A: " + this.dimensions() + ", B: " + vector.dimensions());
        return new Vector(this.coordinates.map((coord, i) => coord.sub(vector.coordinates[i])))
    }

    /**
     * When using this function you must be able to guarantee that this = k * vector
     * @param {Vector} vector
     * @returns a multiplier of this = k * vector
     */
    findMultiplier(vector: Vector) {
        for (let i = 0; i < this.dimensions(); i++) {
            if (!this.get(i).isZero()) {
                return this.get(i).div(vector.get(i));
            }
        }
        throw new Error("Cannot compare zero vector");
    }

    negEntry(row: number) {
        return new Vector(this.coordinates.map((coord, i) => i === row ? coord.neg() : coord));
    }

    neg() {
        return new Vector(this.coordinates.map(coord => coord.neg()));
    }

    set(row: number, value: Complex) {
        return new Vector(this.coordinates.map((coord, i) => i === row ? value : coord));
    }

    get(row: number) {
        return this.coordinates[row].cpy();
    }

    coords() {
        return this.cpy().coordinates;
    }

    addToRow(row: number, value: Complex) {
        return this.set(row, this.get(row).add(value));
    }

    /**
     *
     * @param {Vector} vector
     * @returns
     */
    projectOnto(vector: Vector) {
        return vector.mul(this.dot(vector).divReal(vector.sqrNorm()));
    }

    equals(vector: Vector, precision = BigFloat.ZERO) {
        if (this.dimensions() !== vector.dimensions()) throw new Error("Cannot compare vectors with different dimensions: A: " + this.dimensions() + ", B: " + vector.dimensions());

        if (precision.isZero()) {
            for (let i = 0; i < this.coordinates.length; i++) {
                if (!this.coordinates[i].sub(vector.coordinates[i]).isZero()) return false;
            }

            return true;
        }

        for (let i = 0; i < this.coordinates.length; i++) {
            if (!this.coordinates[i].equals(vector.coordinates[i], precision)) return false;
        }

        return true;
    }

    isEmpty() {
        return this.coordinates.length === 0;
    }

    cpy() {
        return new Vector([...this.coordinates]);
    }

    toString() {
        if (this.isEmpty()) return "[]";

        let word = "[ ";
        for (let i = 0; i < this.dimensions(); i++) {
            word = word + ((i !== 0) ? ", " : "") + this.get(i).toString();
        }
        word += " ]";

        return word;
    }

    isOrthogonal(vector: Vector, precision = BigFloat.ZERO) {
        return this.dot(vector).isZero(precision);
    }

    isUnit(precision = BigFloat.ZERO) {
        return this.sqrNorm().equals(BigFloat.ONE, precision);
    }

    angle(vector: Vector) {
        return this.dot(vector).divReal(vector.norm().mul(vector.norm()));
    }

    /**
     * @param {number} n
     * @returns {Vector} a vector with random coordinates between 0 and 10 (both included)
     */
    static randomVector(n: number) {
        const coords = [];

        for (let index = 0; index < n; index++) {
            coords.push(new Complex(BigFloat.fromNumber(Math.floor(Math.random() * 11)), BigFloat.fromNumber(Math.floor(Math.random() * 11))));
        }
        return new Vector(coords);
    }

    static zero(n: number) {
        return new Vector(new Array(n).fill(Complex.ZERO));
    }
}
