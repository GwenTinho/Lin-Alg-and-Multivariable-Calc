import { abs, exp10, gcd, pm, sign } from "./utils";

// following this https://jrsinclair.com/articles/2020/sick-of-the-jokes-write-your-own-arbitrary-precision-javascript-math-library/

export class BigFloat {
    static readonly ZERO = new BigFloat(0n, 1n);
    static readonly ONE = new BigFloat(1n, 1n);
    static readonly PRECISION = 100;

    constructor(
        private numerator: bigint,
        private denominator: bigint
    ) {
        if (denominator == 0n) throw new Error("Division by zero");
    }

    private static simplify(numerator: bigint, denominator: bigint) {
        const sgn = sign(numerator) * sign(denominator);

        const n = abs(numerator);
        const d = abs(denominator);
        const f = gcd(n, d);

        return new BigFloat((sgn * n) / f, d / f);
    }

    isZero(precision = BigFloat.ZERO) {
        return this.numerator === 0n;
    }

    /**
     *
     * @param val
     * @param precision 0 for exact equality, a value > 0 for fuzzy comparison: abs(this - val) <= precision, no guarantees for precision values < 0
     * @returns
     */
    equals(val: BigFloat, precision = BigFloat.ZERO) {
        const a = BigFloat.simplify(this.numerator, this.denominator);
        const b = BigFloat.simplify(val.numerator, val.denominator);

        if (precision.isZero()) return a.numerator === b.numerator && a.denominator === b.denominator;

        return this.sqrDist(val).lte(precision);
    }

    sign() {
        return sign(this.numerator) * sign(this.denominator);
    }

    abs() {
        return new BigFloat(abs(this.numerator), abs(this.denominator));
    }

    toString() {
        if (this.denominator === 1n) return this.numerator + "";

        return `${this.numerator}/${this.denominator}`;
    }

    toValue() {
        const intPart = this.numerator / this.denominator;
        return (
            Number(this.numerator - intPart * this.denominator) /
            Number(this.denominator) + Number(intPart)
        );
    }

    mul(val: BigFloat) {
        return BigFloat.simplify(
            val.numerator * this.numerator,
            val.denominator * this.denominator
        );
    }

    div(val: BigFloat) {
        return BigFloat.simplify(
            this.numerator * val.denominator,
            this.denominator * val.numerator
        );
    }

    add(val: BigFloat) {
        return BigFloat.simplify(
            this.numerator * val.denominator + val.numerator * this.denominator,
            this.denominator * val.denominator
        );
    }

    sub(val: BigFloat) {
        return BigFloat.simplify(
            this.numerator * val.denominator - val.numerator * this.denominator,
            this.denominator * val.denominator
        );
    }

    neg() {
        return new BigFloat(
            -1n * this.sign() * abs(this.numerator),
            this.denominator
        );
    }

    // for cases where mutability is kinda weird
    cpy() {
        return new BigFloat(
            this.numerator,
            this.denominator
        );
    }

    invert() {
        return BigFloat.simplify(this.denominator, this.numerator);
    }

    lte(val: BigFloat) {
        const a = BigFloat.simplify(
            this.numerator,
            this.denominator
        );
        const b = BigFloat.simplify(
            val.numerator,
            val.denominator
        );
        return a.numerator * b.denominator <= b.numerator * a.denominator;
    }

    lt(val: BigFloat) {
        return this.lte(val) && !this.equals(val);
    }

    gt(val: BigFloat) {
        return !this.lte(val);
    }

    gte(val: BigFloat) {
        return this.gt(val) || this.equals(val);
    }

    floor() {
        const trunc = BigFloat.simplify(this.numerator / this.denominator, 1n);

        if (trunc >= BigFloat.ZERO) return trunc;

        return trunc.sub(BigFloat.ONE);
    }

    ceil() {
        const val = this.floor();

        return this.equals(val) ? val : val.add(BigFloat.ONE);
    }

    static fromNumber(x: number) {
        const expParse = /(-?\d)\.(\d+)e([-+])(\d+)/;
        const [, n, decimals, sgn, pow] = x.toExponential(BigFloat.PRECISION).match(expParse) || [];
        const exp = BigFloat.PRECISION - pm(sgn) * + pow;
        return exp < 0
            ? BigFloat.simplify(BigInt(`${n}${decimals}`) * exp10(-1 * exp), BigInt(1))
            : BigFloat.simplify(BigInt(`${n}${decimals}`), exp10(exp));
    }

    private static nthRoot(num: bigint, n: bigint) {
        if (num === BigInt(1)) return BigFloat.ONE;
        if (num === BigInt(0)) return BigFloat.ZERO;
        if (num < 0) throw new Error("Cannot take negative root");
        // nth root algo:
        const iterations = 4;

        let res = BigFloat.fromNumber(
            Math.pow(Number(num), 1 / Number(n))
        );

        for (let index = 0; index < iterations; index++) {
            res = BigFloat.simplify(
                n - res.numerator ** n + num * (res.denominator ** n),
                n * res.denominator * res.numerator ** (n - 1n)
            )
        }

        return res;
    }

    pow(val: BigFloat) {
        const exp = BigFloat.simplify(val.numerator, val.denominator);

        // we follow the articles instructions for the newtons method implementation for n th roots


        if (this.equals(BigFloat.ZERO)) {
            if (exp.sign() === -1n) throw new Error("Zero to a negative power is undefined");
            if (exp.sign() === 0n) throw new Error("Zero to the power of zero is undefined");
            return BigFloat.ZERO;
        }

        if (exp.lt(BigFloat.ONE) && exp.sign() === 1n && this.sign() === -1n)

            if (exp.denominator === BigInt(1)) {
                return BigFloat.simplify(
                    this.numerator ** exp.numerator,
                    this.denominator ** exp.numerator
                );
            }

        const rootNumer = BigFloat.nthRoot(this.numerator, exp.denominator);
        const rootDenom = BigFloat.nthRoot(this.numerator, exp.denominator);

        const rootDiv = rootNumer.div(rootDenom);

        return new BigFloat(rootDiv.numerator ** exp.numerator, rootDiv.denominator ** exp.numerator);
    }

    floorLog10(): BigFloat {
        if (this.equals(BigFloat.simplify(BigInt(0), BigInt(1)))) {
            return new BigFloat(BigInt(-1), BigInt(0));
        }
        return this.numerator >= this.denominator
            ? BigFloat.simplify(BigInt((this.numerator / this.denominator).toString().length - 1), 1n)
            : BigFloat.simplify(BigInt(-1), BigInt(1)).sub(this.invert().floorLog10());
    }

    sqrt() {
        return this.pow(new BigFloat(1n, 2n));
    }

    sqr() {
        return this.mul(this);
    }

    dist(val: BigFloat) {
        return this.sub(val).abs();
    }

    sqrDist(val: BigFloat) {
        return this.sub(val).sqr();
    }

    // the next few operations are dangerous and should only be used sparringly (lose a ton of precision)

    cos() {
        return BigFloat.fromNumber(Math.cos(this.toValue()));
    }

    sin() {
        return BigFloat.fromNumber(Math.sin(this.toValue()));
    }

    tan() {
        return BigFloat.fromNumber(Math.tan(this.toValue()));
    }

    cosh() {
        return BigFloat.fromNumber(Math.cosh(this.toValue()));
    }

    sinh() {
        return BigFloat.fromNumber(Math.sinh(this.toValue()));
    }

    tanh() {
        return BigFloat.fromNumber(Math.tanh(this.toValue()));
    }

    atan() {
        return BigFloat.fromNumber(Math.atan(this.toValue()));
    }

    acos() {
        return BigFloat.fromNumber(Math.acos(this.toValue()));
    }

    asin() {
        return BigFloat.fromNumber(Math.asin(this.toValue()));
    }
}
