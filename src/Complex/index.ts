import { BigFloat } from "../BigFloat";

export class Complex {

    static readonly ZERO = new Complex(BigFloat.ZERO, BigFloat.ZERO);
    static readonly ONE = new Complex(BigFloat.ONE, BigFloat.ZERO);

    constructor(
        private real: BigFloat,
        private imag: BigFloat
    ) { }

    equals(val: Complex, precision = BigFloat.ZERO) {

        if (precision.isZero()) return this.real === val.real && this.imag === val.imag;

        return this.sqrDist(val).lte(precision);
    }

    cpy() {
        return new Complex(
            this.real.cpy(),
            this.imag.cpy()
        );
    }

    toString() {
        if (this.isZero()) return "0";
        if (this.isReal()) return this.real.toString();

        const imagSign = this.imag.sign() === 1n ? "+" : "-";

        if (this.isImag()) return "0 " + imagSign + " i " + this.imag.abs().toString();

        return this.real.toString() + " " + imagSign + " i " + this.imag.abs().toString();
    }

    isZero(precision = BigFloat.ZERO) {
        if (precision.isZero()) return this.real.isZero() && this.imag.isZero();

        return this.mag().lte(precision);
    }

    /**
     * Real less than or equal, compares the real part of the complex number to the value
     * @param val
     * @returns
     */
    rLte(val: BigFloat) {
        return this.real.lte(val);
    }

    rLt(val: BigFloat) {
        return this.real.lte(val) && !this.real.equals(val);
    }

    rGt(val: BigFloat) {
        return !this.real.lte(val);
    }

    rGte(val: BigFloat) {
        return this.real.gt(val) || this.real.equals(val);
    }

    isReal() {
        return this.imag.isZero();
    }

    isImag() {
        return this.real.isZero();
    }

    sqrMag() {
        return this.real.sqr().add(this.imag.sqr());
    }

    mag() {
        return this.sqrMag().sqrt();
    }

    compl() {
        return new Complex(
            this.real.cpy(),
            this.imag.neg()
        );
    }

    neg() {
        return new Complex(
            this.real.neg(),
            this.imag.neg()
        );
    }

    add(val: Complex) {
        return new Complex(
            this.real.add(val.real),
            this.imag.add(val.imag)
        );
    }

    sub(val: Complex) {
        return new Complex(
            this.real.sub(val.real),
            this.imag.sub(val.imag)
        );
    }

    mulReal(val: BigFloat) {
        return new Complex(
            this.real.mul(val),
            this.imag.mul(val)
        );
    }

    mul(val: Complex) {
        return new Complex(
            this.real.mul(val.real).sub(this.imag.mul(val.imag)),
            this.real.mul(val.imag).add(this.imag.mul(val.real))
        );
    }

    divReal(val: BigFloat) {
        return new Complex(
            this.real.div(val),
            this.imag.div(val)
        );
    }

    inverse() {
        return this.compl().divReal(this.sqrMag());
    }

    div(val: Complex) {
        return this.mul(val.compl()).divReal(val.sqrMag());
    }

    realPart() {
        return this.real;
    }

    imaginaryPart() {
        return this.imag;
    }

    /**
     *
     * @returns the argumeent of the complex number as a BigFloat, calculation might be lossy so beware
     */
    arg() {
        return this.imag.div(this.real).atan();
    }

    pow(val: Complex) {
        const e = BigFloat.fromNumber(Math.E);

        const resMag = this.mag().mul(e.pow(this.arg().neg().mul(val.imag))); // using the formula z^w = r * e^(-b^theta) * e^(i*a*theta)
        const resArg = this.arg().mul(val.real);

        return new Complex(
            resMag.mul(resArg.cos()),
            resMag.mul(resArg.sin())
        );
    }

    sqrDist(val: Complex) {
        return this.sub(val).sqrMag();
    }

    dist(val: Complex) {
        return this.sub(val).mag();
    }

    floor() {
        return new Complex(
            this.real.floor(),
            this.imag.floor()
        );
    }

    ceil() {
        return new Complex(
            this.real.ceil(),
            this.imag.ceil()
        );
    }

    static fromReal(val: BigFloat) {
        return new Complex(
            val.cpy(),
            BigFloat.ZERO
        );
    }

    static fromImag(val: BigFloat) {
        return new Complex(
            val.cpy(),
            BigFloat.ZERO
        );
    }
}
