import Vector from "../Vector";
import Matrix from "../Matrix";

// a class that describes a multivariable function R^n -> R^m and implements a bunch of operators for that function

class MFunction {
    constructor(inputDimensions, outputDimensions, vectorfn) {
        this.inputDimensions = inputDimensions >= 1 ? inputDimensions : 1;
        this.outputDimensions = outputDimensions >= 1 ? outputDimensions : 1;
        this.isParamFn = inputDimensions === 1; // parametric as in R -> R^n
        this.calc;
        this.isJacobianSet = false;
        this.getJacobianAt;
        this.getGradientAt;
        this.isHessianSet = false;
        this.getHessianAt;
        this.isScalarValued = this.outputDimensions === 1; // scalar as in R^n -> R
        this.isVectorField = this.outputDimensions === this.inputDimensions; // vector field as in R^n -> R^n
        this.setOutput(vectorfn, outputDimensions);
    }

    setOutput(vectorfn) { // instead of functionarray use a function that simply takes in one vector and outputs another vector or scalar depending on the type
        this.calc = vectorfn;
        return this;
    }

    partialDerivative(index) { // R^n -> R^m // returns a function that returns a vector with all the derivatives with respect to the variable at index
        if (this.isParamFn) return new Error("invalid structure for partial deriv");
        return v => { // v is a vector
            const h = 1e-10;
            let u = v.copyInstance();
            return this.calc(v.addToRow(index, h)).sub(this.calc(u.addToRow(index, -h))).mult(0.5 / h);
        }
    }

    initJacobian() {
        if (this.isParamFn) {
            this.getJacobianAt = t => MFunction.paramDeriv(t, this.calc);
        } else {
            this.getJacobianAt = v => {
                let vectors = [];
                for (let index = 0; index < this.inputDimensions; index++) {
                    vectors.push(this.partialDerivative(index)(v));
                }
                return new Matrix(vectors);
            }
        }
        if (this.isScalarValued) this.getGradientAt = v => this.getJacobianAt(v).T().getCol(0);
        this.isJacobianSet = true;
    }

    directionalDerivative(v, x) { // x along v
        return this.getGradientAt(x).dot(v);
    }

    getCurvatureAt(t) {
        if (!this.isParamFn) return new Error("invalid structure for curvature");

        const dS = MFunction.paramDeriv(t, this.calc); // 1st deriv

        const ddS = MFunction.secondParaDeriv(t, this.calc); // 2nd deriv

        const ddSNormSquared = ddS.getNormSquared();
        const dSNormSquared = dS.getNormSquared();
        const dSNorm = dS.getNorm();

        const dotProdSquared = ddS.dot(dS) ** 2;

        return Math.sqrt(ddSNormSquared * dSNormSquared - dotProdSquared) / (dSNorm ** 3);
    }

    getUnitTangent(t) {
        if (!this.isParamFn) return new Error("invalid structure for unit tan");

        return MFunction.paramDeriv(t, this.calc).asUnit();
    }

    getPrincipleUnitNormal(t) {
        if (!this.isParamFn) return new Error("invalid structure for unit norm");

        return MFunction.paramDeriv(t, this.getUnitTangent).asUnit();
    }

    getDivergence(t) {
        if (!this.isVectorField) return new Error("invalid structure for Divergence (not a vector field)");
        if (!this.isJacobianSet) this.initJacobian();

        return this.getJacobianAt(t).trace();
    }

    getLaplacian(t) {
        if (!this.isScalarValued) return new Error("invalid structure for laplacian (not scalar valued)");

        let laplacianGenerator = new MFunction(this.inputDimensions, this.inputDimensions, this.getGradientAt);

        return laplacianGenerator.getDivergence(t); // tr(J(grad(f)))

        // needs testing
        // fun fact: laplacian = trace of Hessian, which would be slower than out code here but still
    }

    initHessian() {
        if (!this.isScalarValued) return new Error("invalid structure for Hessian (not scalar valued)");

        if (!this.isJacobianSet) this.initJacobian();

        let hessianGenerator = new MFunction(this.inputDimensions, this.inputDimensions, this.getGradientAt);

        hessianGenerator.initJacobian();

        this.getHessianAt = hessianGenerator.getJacobianAt;
        this.isHessianSet = true; // this needs a lot of testing
    }

    secondDeriveTest() {
        // research this and make it work
    }

    getCurl(v) {
        if (!this.isVectorField) return new Error("invalid structure for Curl (not a vector field)");
        if (this.inputDimensions == 2) { // 2d case R^2 -> R (actually still R^3 to R^3 but a bit compressed)

            // WRT means with respect to, i.e. partialQ / partialX

            const qWRTx = this.partialDerivative(0)(v).get(1); // index 0 is x index 1 is Q (f(x,y) = [P(x,y), Q(x,y)]^T)
            const pWRTy = this.partialDerivative(1)(v).get(0);

            return qWRTx - pWRTy; // z coordinate of the 3d vector (in reality curl(f) = [0,0, 2d-curl(f)]^T)
        }
        if (this.inputDimensions == 3) { // 3d case R^3 -> R^3
            // do things
        }
        if (this.inputDimensions > 3) {
            // do things
        }
    }

    static paramDeriv(t, paramFn) { // R -> R^n // dont use repeated
        // t is a scalar
        const h = 1e-10;
        const v1 = paramFn(t - h);
        const v2 = paramFn(t + h);

        v2.sub(v1).mult(0.5 / h);
        return v2;
    }

    static secondParaDeriv(t, paramFn) {
        // t is a scalar
        const h = 1e-6;
        const v1 = paramFn(t + 2 * h);
        const v2 = paramFn(t + h).mult(2);
        const v3 = paramFn(t);

        v1.sub(v2).add(v3).mult(1 / (h * h));
        return v1;
    }
}

export default MFunction;