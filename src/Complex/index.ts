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

    isZero(precision = BigFloat.ZERO) {
        if (precision.isZero()) return this.real.isZero() && this.imag.isZero();

        return this.mag().lte(precision);
    }

    isReal() {
        return this.imag.isZero();
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

    div(val: Complex) {
        return this.mul(val.compl()).divReal(val.sqrMag());
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
