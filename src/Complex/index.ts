import { BigFloat } from "../BigFloat";

export class Complex {

    static readonly ZERO = new Complex(BigFloat.ZERO, BigFloat.ZERO);
    static readonly ONE = new Complex(BigFloat.ONE, BigFloat.ZERO);

    constructor(
        private real: BigFloat,
        private imag: BigFloat
    ) { }

    static fromString(expr: string) {
        let tokens = expr.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g)?.filter(val => val !== " ");

        if (
            tokens === undefined ||
            tokens.length !== 1 &&
            tokens.length !== 2 &&
            tokens.length !== 4 &&
            tokens.length !== 5
        ) throw new Error("Can't parse invalid expression: " + expr);

        // still needs testing and i can already smell all the edge cases

        if (tokens[tokens.length - 1] === "i") throw new Error("unsupported complex format: " + expr + "\n format is a + ib");

        let real = BigFloat.ZERO;
        let imag = BigFloat.ZERO;
        let imagFlag = false;
        let sign = "";

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token === "i") {
                imagFlag = true;
                continue;
            }

            if (token === "+" || token === "-") {
                sign = token === "-" ? "-" : "";
                continue;
            }

            if (!!parseFloat(token) || parseFloat(token) === 0) {
                if (imagFlag) {
                    imag = BigFloat.fromString(token);
                } else {
                    real = BigFloat.fromString(token);
                }
            }
        }

        return new Complex(real, imag);
    }

    equals(val: Complex, precision = BigFloat.ZERO) {

        if (precision.isZero()) return this.real.equals(val.real) && this.imag.equals(val.imag);

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

    isReal(precision = BigFloat.ZERO) {
        return this.imag.isZero(precision);
    }

    isImag(precision = BigFloat.ZERO) {
        return this.real.isZero(precision);
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
        // following this https://en.wikipedia.org/wiki/Argument_(complex_analysis) (uniform formula)
        if (!this.imag.equals(BigFloat.ZERO)) return this.mag().sub(this.real).div(this.imag).atan().mul(BigFloat.fromNumber(2));
        if (this.real.lt(BigFloat.ZERO) && this.imag.equals(BigFloat.ZERO)) return BigFloat.fromNumber(Math.PI);
        if (this.real.gt(BigFloat.ZERO) && this.imag.equals(BigFloat.ZERO)) return BigFloat.ZERO;

        throw new Error("argument of " + this.toString() + " is undefined");
    }

    pow(val: Complex) {
        debugger
        const e = BigFloat.fromNumber(Math.E);

        const resMag = this.mag().mul(e.pow(this.arg().neg().mul(val.imag))); // using the formula z^w = r * e^(-b^theta) * e^(i*a*theta)
        const resArg = this.arg().mul(val.real);

        return new Complex(
            resMag.mul(resArg.cos()),
            resMag.mul(resArg.sin())
        );
    }

    sqrt() {
        debugger
        return this.pow(Complex.fromReal(new BigFloat(1n, 2n)));
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

    toValuePair() {
        return [this.real.toValue(), this.imag.toValue()];
    }

    static fromReal(val: BigFloat) {
        console.log(val.cpy())
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
