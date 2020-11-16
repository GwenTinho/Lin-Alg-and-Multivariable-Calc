import Matrix from "../linalg/Matrix";

class InverseTester {
    constructor(runs, dimensions, maxError = 1e-6) {
        this.runs = runs;
        this.dimensions = dimensions;
        this.maxError = maxError;
    }

    run() {
        let positiveCounter = 0;
        let singularCounter = 0;

        for (let index = 0; index < this.runs; index++) {
            const A = Matrix.randomIntMatrix(this.dimensions, this.dimensions);
            const inverseA = A.getInverse();
            if (!inverseA) {
                singularCounter++;
                continue;
            }
            if (A.mul(inverseA).isEqual(Matrix.getIdentityMatrix(this.dimensions), this.maxError)) positiveCounter++;
        }

        return positiveCounter / (this.runs - singularCounter);
    }
}

export default InverseTester;