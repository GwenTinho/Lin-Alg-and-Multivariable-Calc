import Matrix from "./Matrix";

class EquationSolver {

    /**
     * 
     * @param {Matrix} A coefficent matrix of equation AX = B (A is nxn)
     * @param {Matrix} B constant matrix of equation AX = B (B is nxm)
     */
    constructor(A, B) {
        this.coefficientMatrix = A;
        this.constantMatrix = B;
    }

    solve() {
        const solutionRows = this.constantMatrix.getDimensions()[0];
        const solutionColumns = this.constantMatrix.getDimensions()[1];

        let augmentedMatrix = new Matrix(this.coefficientMatrix.getVectors().concat(this.constantMatrix.getVectors()));

        let solvedSystem = augmentedMatrix.getRref();

        return new Matrix(solvedSystem.getVectors().splice(solutionRows, solutionColumns));
    }
}

export default EquationSolver;