import Vector from "../Vector";
import Matrix from "../Matrix";
import Plane from "../Plane";
import Point from "../Point";

// a class that describes a multivariable function R^n -> R^m and implements a bunch of operators for that function

class MFunction {
    constructor(inputDimensions, outputDimensions, vectorfn) {
        this.inputDimensions = inputDimensions >= 1 ? inputDimensions : 1;
        this.outputDimensions = outputDimensions >= 1 ? outputDimensions : 1;
        this.paramFn = inputDimensions === 1; // parametric as in R -> R^n
        this.calc;
        this.jacobianSet = false;
        this.getJacobianAt;
        this.getGradientAt;
        this.hessianSet = false;
        this.getHessianAt;
        this.harmonic;
        this.scalarValued = this.outputDimensions === 1; // scalar as in R^n -> R
        this.vectorField = this.outputDimensions === this.inputDimensions; // vector field as in R^n -> R^n
        this.setOutputFunction(vectorfn, outputDimensions);
        this.initJacobian();
        this.initHessian();
    }

    setOutputFunction(vectorfn) {
        this.calc = vectorfn;
    }

    partialDerivative(index, v) { // R^n -> R^m // returns a function that returns a vector with all the derivatives with respect to the variable at index
        if (this.paramFn) return new Error("invalid structure for partial deriv");
        // v is a vector
        const h = 1e-10;

        const u = v.copyInstance();

        const w = v.copyInstance();

        // technicality: scalar has to be used as 1x1 vector to allow for matrix operators

        if (this.scalarValued) return new Vector([(this.calc(w.addToRow(index, h)) - this.calc(u.addToRow(index, -h))) * (0.5 / h)]);

        return this.calc(w.addToRow(index, h)).sub(this.calc(u.addToRow(index, -h))).mult(0.5 / h);

    }

    secondPartialDerivative(index1, index2, v) {
        if (this.paramFn) return new Error("invalid structure for scnd partial deriv");

        // v is a vector
        const h = 9e-6;

        const s = v.copyInstance();
        const t = v.copyInstance();
        const u = v.copyInstance();
        const w = v.copyInstance();

        // technicality: scalar has to be used as 1x1 vector to allow for matrix operators

        const multiplier = 0.25 / h; // uses midpoint for more accuracy // also need to add this to the other derivation algs


        const v1 = index1 === index2 ? s.addToRow(index1, 2 * h) : s.addToRow(index1, h).addToRow(index2, h);
        const v2 = index1 === index2 ? t.addToRow(index1, -2 * h) : t.addToRow(index1, -h).addToRow(index2, -h);
        const v3 = index1 === index2 ? u : u.addToRow(index1, -h).addToRow(index2, h);
        const v4 = index1 === index2 ? w : w.addToRow(index1, h).addToRow(index2, -h);

        if (this.scalarValued) {
            const homoVScalar = this.calc(v1) + this.calc(v2);
            const heterVScalar = this.calc(v3) + this.calc(v4);

            return new Vector([((homoVScalar - heterVScalar) * multiplier) / h]); // divide by h in 2 different steps to avoid floating point errors
        }

        const homoVScalar = this.calc(v1).add(this.calc(v2));
        const heterVScalar = this.calc(v3).add(this.calc(v4));
        return homoVScalar.sub(heterVScalar).mult(multiplier).mult(1 / h);

        // this is really bad and converges only for small values if used with functions like e^x

    }


    initJacobian() {
        if (this.paramFn) {
            this.getJacobianAt = t => MFunction.paramDeriv(t, this.calc);
        } else {
            this.getJacobianAt = v => {
                let vectors = [];
                for (let index = 0; index < this.inputDimensions; index++) {
                    vectors.push(this.partialDerivative(index, v));
                }
                return new Matrix(vectors);
            }
        }
        if (this.scalarValued) this.getGradientAt = v => this.getJacobianAt(v).T().getCol(0);
        this.jacobianSet = true;
    }

    getJacobianDetAt(v) {
        return this.getJacobianAt(v).initValues().det;
    }

    directionalDerivative(v, x) { // x along v
        return this.getGradientAt(x).dot(v);
    }

    getCurvatureAt(t) { // R -> R
        if (!this.paramFn) return new Error("invalid structure for curvature");

        const dS = MFunction.paramDeriv(t, this.calc); // 1st deriv

        const ddS = MFunction.secondParamDeriv(t, this.calc); // 2nd deriv

        const ddSNormSquared = ddS.getNormSquared();
        const dSNormSquared = dS.getNormSquared();
        const dSNorm = dS.getNorm();

        const dotProdSquared = ddS.dot(dS) ** 2;

        return Math.sqrt(ddSNormSquared * dSNormSquared - dotProdSquared) / (dSNorm ** 3);
    }

    getUnitTangent(t) {
        if (!this.paramFn) return new Error("invalid structure for unit tan");

        return MFunction.paramDeriv(t, this.calc).asUnit();
    }

    getPrincipleUnitNormal(t) {
        if (!this.paramFn) return new Error("invalid structure for unit norm");

        return MFunction.paramDeriv(t, this.getUnitTangent).asUnit();
    }

    getDivergence(v) { // R^n -> R
        if (!this.vectorField) return new Error("invalid structure for Divergence (not a vector field)");

        return this.getJacobianAt(v).trace();
    }

    getLaplacian(v) { // R^n -> R
        if (!this.scalarValued) return new Error("invalid structure for laplacian (not scalar valued)");

        return this.getHessianAt(v).trace();

        // why it works: laplacian f = div(grad f) = trace(J(grad f)) = trace(H(f))
        // but the derivative algorithms need to improve a lot for decent accuracy (rn its pretty bad)
    }

    isHarmonic(testVectors) {
        if (!this.scalarValued) return new Error("invalid structure for harmonic");

        const err = 1e-8;

        for (let index = 0; index < testVectors.length; index++) {
            if (this.getLaplacian(testVectors[index]) ** 2 >= err) {
                this.harmonic = false;
                return false;
            }
        }

        this.harmonic = true;
        return true; // kinda shit cuz the laplacian is inaccurate as fuck
    }

    initHessian() {
        if (!this.scalarValued) return new Error("invalid structure for Hessian (not scalar valued)");

        this.getHessianAt = v => {
            let vectors = [];
            for (let col = 0; col < this.inputDimensions; col++) {
                let coords = [];

                for (let row = 0; row < this.inputDimensions; row++) {
                    coords.push(this.secondPartialDerivative(row, col, v).get(0));
                }
                vectors.push(new Vector(coords));
            }

            return new Matrix(vectors);
        }
        this.hessianSet = true;
    }

    // my naive eigenvalue algorithm that only allows for real valued solution to the characteristic polynomial
    // still allows us to get all the eigenvalues of a real symmetric matrix, so it should work just fine

    // technically i would also have to check wheter the hessian is invertible but ill keep that for another time i think

    isCritical(v) {
        if (!this.scalarValued) return new Error("invalid structure for critical points (not scalar valued)");

        const err = 1e-8;

        return this.getGradientAt(v).getNormSquared() < err;
    }

    hasMinimumAt(v) {
        if (!this.scalarValued) return new Error("invalid structure for minimum using hessian (not scalar valued)");

        return this.getHessianAt(v).isPositiveDefinite() && this.isCritical(v);
    }

    hasMaximumAt(v) {
        if (!this.scalarValued) return new Error("invalid structure for maximum using hessian (not scalar valued)");

        return this.getHessianAt(v).isNegativeDefinite() && this.isCritical(v);
    }

    hasSaddleAt(v) {
        if (!this.scalarValued) return new Error("invalid structure for saddle using hessian (not scalar valued)");

        let l = this.getHessianAt(v);

        return l.isNonDefinite() && this.isCritical(v);
    }

    getNthPartialDeriv() {
        // some day ...
    }

    getCurl(v) {
        if (!this.vectorField) return new Error("invalid structure for Curl (not a vector field)");
        if (this.inputDimensions == 2) { // 2d case R^2 -> R (actually still R^3 to R^3 but a bit compressed)

            // WRT means with respect to, i.e. partialQ / partialX

            const qWRTx = this.partialDerivative(0)(v).get(1); // index 0 is x index 1 is Q (f(x,y) = [P(x,y), Q(x,y)]^T)
            const pWRTy = this.partialDerivative(1)(v).get(0);

            return qWRTx - pWRTy; // z coordinate of the 3d vector (in reality curl(f) = [0,0, 2d-curl(f)]^T)
        }
        if (this.inputDimensions == 3) { // 3d case R^3 -> R^3

            const jacobian = this.getJacobianAt(v);

            const rWRTy = jacobian.get(2, 1); // index 2 is (row) R index 1 is (column) Y (f(x,y,z) = [P(x,y,z), Q(x,y,z), R(x,y,z)]^T)
            const qWRTz = jacobian.get(1, 2);
            const resultX = rWRTy - qWRTz;

            const rWRTx = jacobian.get(2, 0);
            const pWRTz = jacobian.get(0, 2);
            const resultY = pWRTz - rWRTx;

            const qWRTx = jacobian.get(1, 0);
            const pWRTy = jacobian.get(0, 1);
            const resultZ = qWRTx - pWRTy;

            return new Vector([
                resultX,
                resultY,
                resultZ
            ]);
        }
        if (this.inputDimensions > 3) {
            return new Error("I don't understand the generalizations yet");
        }
    }

    getLocalLinearization(v) { // returns a new functions that gives the local linearisation around that point P(v)
        if (!this.scalarValued) return new Error("invalid structure for LL (not scalar valued)");

        const fAtP = this.calc(v);
        const gradAtP = this.getGradientAt(v);

        return new MFunction(this.inputDimensions, 1, u => fAtP + gradAtP.dot(u.copyInstance().sub(v))); // maybe make functions immutable in general ...
        // needs testing
    }

    getQuadraticApproximation(v) { // returns a new functions that gives the quadratic approximation around that point P(v)
        if (!this.scalarValued) return new Error("invalid structure for QA (not scalar valued)");

        const hessianAtP = this.getHessianAt(v);

        return new MFunction(this.inputDimensions, 1, u => this.getLocalLinearization(v).calc(u) + 0.5 * hessianAtP.wrapToScalar(u.copyInstance().sub(v)));
        // needs testing
    }

    getTangentPlane(v) { // v is a 2d vector
        if (this.inputDimensions !== 2 || !this.scalarValued) return new Error("invalid structure for Tangent (not scalar valued or wrong inputdimensions)");

        const gradient = this.getGradientAt(v);
        const d1 = new Vector([1, 0, gradient.get(0)]);
        const d2 = new Vector([0, 1, gradient.get(1)]);
        const point = new Point([v.get(0), v.get(1), this.calc(v)]);

        return new Plane(d1, d2, point); // needs testing
    }

    static paramDeriv(t, paramFn) { // R -> R^n // dont use repeated
        // t is a scalar
        const h = 1e-10;
        const v1 = paramFn(t - h);
        const v2 = paramFn(t + h);

        v2.sub(v1).mult(0.5 / h);
        return v2;
    }

    static secondParamDeriv(t, paramFn) {
        // t is a scalar
        const h = 1e-6;
        const v1 = paramFn(t + 2 * h);
        const v2 = paramFn(t + h).mult(2);
        const v3 = paramFn(t);

        v1.sub(v2).add(v3).mult(1 / (h * h));
        return v1;
    }

    static nthParamDeriv() {
        // also some day ...
    }
}

export default MFunction;