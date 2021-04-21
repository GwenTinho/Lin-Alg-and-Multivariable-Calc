import Matrix from "./Matrix";

class EquationSolver {

    /**
     *
     * @param {Matrix} A coefficent matrix of equation AX = B (A is nxn)
     * @param {Matrix} B constant matrix of equation AX = B (B is nxm)
     */
    constructor(A, B) {
        this.A = A;
        this.B = B;
    }

    solve() {
        const solutionRows = this.B.getDimensions()[0];
        const solutionColumns = this.B.getDimensions()[1];

        let augmentedMatrix = new Matrix(this.A.getVectors().concat(this.B.getVectors()));

        let solvedSystem = augmentedMatrix.getRref();

        return new Matrix(solvedSystem.getVectors().splice(solutionRows, solutionColumns));
    }

    lsa() {
        if (B.getDimensions()[1] !== 1) throw new Error("Cannot approximate matrix with LSA");

        let AT = this.A.T();

        return AT.mul(this.A).getInverse().mul(AT).multByVector(this.B.vectors[0]);
    }
}

export default EquationSolver;
