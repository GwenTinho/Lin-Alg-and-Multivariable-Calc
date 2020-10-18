import Matrix from "../linalg/Matrix";

class InverseTester {
    constructor(runs, dimensions, maxError = 1e-6) {
        this.runs = runs;
        this.dimensions = dimensions;
        this.maxError = maxError;
    }

    run() {
        let positive = 0;

        for (let index = 0; index < this.runs; index++) {
            const A = Matrix.randomIntMatrix(this.dimensions, this.dimensions);
            const inverseA = A.getInverse();
            if (!inverseA) continue;
            if (A.mul(inverseA).isEqual(Matrix.getIdentityMatrix(this.dimensions), this.maxError)) positive++;
        }

        return positive / this.runs;
    }
}

export default InverseTester;