import { BigFloat } from "../BigFloat";
import { Complex } from "../Complex";
import { Vector } from "../Vector";
import { rref } from "../utils/rref";
import { powerIteration } from "../utils/poweriteration";
import basisFinder from "../utils/basisFinder";
import { findQR, gramSchmidt } from "../utils/gramSchmidt";
import { getUniqueVectors } from "../utils/getUniqueVectors";

export class Matrix {
    private det!: Complex;
    private inverse!: Matrix;
    private rref!: Matrix;
    private orthogonal!: Boolean;
    private symmetric!: Boolean;
    private diagonal!: boolean;
    private upperTriangular!: boolean;
    private lowerTriangular!: boolean;
    private triangular!: boolean;
    private validDimensional!: boolean;
    private conversionMatrix!: Matrix;
    private rank!: number;
    private invertible!: boolean;
    private initialized = false;

    constructor(private vectors: Vector[]) {

        if (vectors.length == 0) throw new Error("empty vectors array");

        if (!this.isValidDimensional()) throw new Error("invalid dimensions");
    }

    static fromStrings(rows: string[]) {
        return (new Matrix(
            rows.map(rowString => new Vector(rowString.split(" ").map(expr => {
                // TODO: known bug, with minuses

                const splitExpr = expr.split("[+-]");


                const real = BigFloat.fromNumber(parseFloat(splitExpr[0]));
                let imag: BigFloat;

                if (splitExpr[1]) imag = BigFloat.fromNumber(parseFloat(splitExpr[1]));
                else imag = BigFloat.ZERO;

                return new Complex(real, imag);
            })
            )))).T();
    }

    /**
     * @returns {Vector[]} a array of column vectors
     */
    getVectors() {
        return this.cpy().vectors;
    }

    isValidDimensional() {
        if (this.validDimensional == null) {
            const comp = this.vectors[0].dimensions();

            for (let index = 0; index < this.vectors.length; index++) {
                if (comp != this.vectors[index].dimensions()) {
                    this.validDimensional = false;
                    return false;
                }
            }
            this.validDimensional = true;
            return true;
        }
        return this.validDimensional;
    }

    multByVector(vector: Vector) {
        let coords = [];

        const rows = this.dimensions()[0];

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            coords.push(this.getRow(rowIndex).dot(vector));
        }

        return new Vector(coords);
    }

    wrapToScalar(vector: Vector) { // (x^T)Ax = x.Ax = Ax.x
        return this.multByVector(vector).dot(vector);
    }

    multByScalar(number: Complex) {
        return new Matrix(this.vectors.map(vector => vector.mul(number)));
    }

    initValues() { // fix this piece of garbage

        if (this.initialized) return this;

        if (this.isSquare()) this.symmetric = this.equals(this.T());

        const reducer = rref(this);

        this.rref = reducer.rref.cpy();

        this.det = reducer.determinant;

        this.invertible = !this.det.isZero();

        if (this.invertible) {
            this.inverse = reducer.conversionMatrix.cpy();
            this.conversionMatrix = reducer.conversionMatrix.cpy();
        } else {
            this.conversionMatrix = reducer.conversionMatrix.cpy();
        }
        this.orthogonal = this.det.isZero() ? false : this.equals(this.inverse.T());

        this.rank = this.rref.calcNonZeroRows();
        this.initialized = true;

        return this;
    }

    /**
     *  @returns {Matrix} the rref of this
     */

    getRref() {
        if (!this.initialized) {
            this.initValues();
        }
        return this.rref;
    }

    getNulliy() {
        return this.dimensions()[1] - this.getRank();
    }

    getRank() {
        if (!this.initialized) {
            this.initValues();
        }
        return Number(this.rank);
    }

    getInverse() {
        if (!this.initialized) {
            this.initValues();
        }
        return this.inverse;
    }

    getConversionMatrix() {
        if (!this.initialized) {
            this.initValues();
        }
        return this.conversionMatrix;
    }

    getDeterminant() {
        if (!this.initialized) {
            this.initValues();
        }
        return this.det;
    }

    isOrthogonal() {
        if (!this.initialized) {
            this.initValues();
        }
        return this.orthogonal;
    }

    isSymmetric() {
        if (!this.initialized) {
            this.initValues();
        }
        return this.symmetric;
    }

    isUpperTriangular() {
        if (!this.isSquare()) return false;
        if (typeof this.upperTriangular === "boolean") return this.upperTriangular;

        const size = this.dimensions()[0];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i > j && this.get(i, j).isZero()) {
                    this.upperTriangular = false;
                    return false;
                }
            }
        }
        this.upperTriangular = true;
        return true;
    }

    isLowerTriangular() {
        if (!this.isSquare()) return false;
        if (typeof this.lowerTriangular === "boolean") return this.lowerTriangular;

        const size = this.dimensions()[0];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i < j && this.get(i, j).isZero()) {
                    this.lowerTriangular = false;
                    return false;
                }
            }
        }
        this.lowerTriangular = true;
        return true;
    }

    isTriangular() {
        if (!this.isSquare()) return false;
        if (typeof this.triangular === "boolean") return this.triangular;

        this.triangular = this.isLowerTriangular() || this.isUpperTriangular();
        return this.triangular;
    }

    isDiagonal() {
        if (!this.isSquare()) return false;
        if (typeof this.diagonal === "boolean") return this.diagonal;

        const size = this.dimensions()[0];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i !== j && this.get(i, j).isZero()) {
                    this.diagonal = false;
                    return false;
                }
            }
        }
        this.diagonal = true;
        return true;
    }

    isPositiveDefinite() {
        if (!this.isSymmetric()) throw new Error("Non symmetric matrix has no quadratic form");

        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index].rLte(BigFloat.ZERO)) return false;
        }

        return true;
    }

    isPositiveSemiDefinite() {
        if (!this.isSymmetric()) throw new Error("Non symmetric matrix has no quadratic form");

        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index].rLt(BigFloat.ZERO)) return false;
        }

        return true;
    }

    isNegativeDefinite() {
        if (!this.isSymmetric()) throw new Error("Non symmetric matrix has no quadratic form");

        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index].rGte(BigFloat.ZERO)) return false;
        }

        return true;
    }

    isNegativeSemiDefinite() {
        if (!this.isSymmetric()) throw new Error("Non symmetric matrix has no quadratic form");

        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index].rGt(BigFloat.ZERO)) return false;
        }

        return true;
    }

    isNonDefinite() { // one of each (atleast 1 neg and 1 pos) (needed to decide if function has a saddle point)
        if (!this.isSymmetric()) throw new Error("Non symmetric matrix has no quadratic form");

        const eigenV = this.getEigenValues();
        let count = 0;

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index].rGt(BigFloat.ZERO)) {
                count++;
                break;
            }
        }

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index].rLt(BigFloat.ZERO)) {
                count++;
                break;
            }
        }

        return count === 2;
    }

    get(row: number, column: number) {
        return this.vectors[column].get(row);
    }

    getCol(col: number) {
        if (col >= 0 && col < this.dimensions()[1]) return this.vectors[col].cpy();
        throw new Error("Invalid column index in getCol: " + col);
    }

    getRow(row: number) {
        if (row >= 0 && row < this.dimensions()[0]) {
            let coords = [];

            const nbrColumns = this.dimensions()[1];

            for (let col = 0; col < nbrColumns; col++) {
                coords.push(this.get(row, col));
            }

            return new Vector(coords);
        }
        throw new Error("Invalid row index in getRow: " + row);
    }

    set(row: number, column: number, value: Complex) { // implement better error handling
        return new Matrix(this.vectors.map((colV, rowIdx) => row === rowIdx ? colV.set(row, value) : colV.cpy()));
    }

    neg(row: number, column: number) {
        return new Matrix(this.vectors.map((colV, rowIdx) => row === rowIdx ? colV.neg(row) : colV.cpy()));
    }

    truncate(n: number) {
        let [rows, cols] = this.dimensions();
        let outM = this.cpy();

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const val = this.get(r, c);
                outM.set(r, c, val.mulReal(BigFloat.fromNumber(10 ** n)).floor().divReal(BigFloat.fromNumber(10 ** n)));
            }
        }

        return outM;
    }

    /**
     * Gives back the order of the matrix as an array
     *
     * @returns {number[]} [row,column]
     *
     */

    dimensions() { // row column
        return [this.vectors[0].dimensions(), this.vectors.length];
    }

    calcNonZeroRows() {
        const rows = this.dimensions()[0];
        const columns = this.dimensions()[1];
        let counter = 0;

        for (let index = 0; index < rows; index++) {
            if (this.getRow(index).equals(Vector.zero(columns))) counter++;
        }

        return rows - counter;
    }

    isSameDimensions(matrix: Matrix) {
        const dim1 = this.dimensions();
        const dim2 = matrix.dimensions();

        return dim1[0] === dim2[0] && dim1[1] === dim2[1];
    }

    isSquare() {
        const dim = this.dimensions();

        return dim[0] === dim[1];
    }

    /**
     *
     * @param {Matrix} Matrix Matrix that we compare against
     * @param {number} maxError maximum margin of error (Defaults to 1e-6)
     * @returns {Boolean} true if the absolute difference between each entry is within the maxError
     */
    equals(matrix: Matrix, precision = BigFloat.ZERO) {
        if (!this.isSameDimensions(matrix)) return false;

        for (let i = 0; i < this.vectors.length; i++) {
            if (!this.vectors[i].equals(matrix.vectors[i], precision)) return false;
        }

        return true;
    }

    T() {
        let matrix = this.cpy();
        let dims = matrix.dimensions();
        let rowVectors = [];

        for (let i = 0; i < dims[0]; i++) { // rows
            let coords = [];

            for (let j = 0; j < dims[1]; j++) { // columns
                coords.push(matrix.get(i, j));
            }
            rowVectors.push(new Vector(coords));
        }

        return new Matrix(rowVectors);
    }

    compl() {
        return new Matrix(this.vectors.map((vector, i) => vector.compl()));
    }

    hermitian() {
        return this.compl().T();
    }

    add(matrix: Matrix) {
        return new Matrix(this.vectors.map((vector, i) => vector.add(matrix.vectors[i])));
    }

    sub(matrix: Matrix) {
        return new Matrix(this.vectors.map((vector, i) => vector.sub(matrix.vectors[i])));
    }

    mul(matrix: Matrix) {

        if (this.dimensions()[1] !== matrix.dimensions()[0]) throw new Error("Dimensions don't match: A: [" + this.dimensions() + "] B: [" + matrix.dimensions() + "]"); // check if they can be multiplied


        let colVectors = [];

        const columns = matrix.dimensions()[1];

        for (let colIndex = 0; colIndex < columns; colIndex++) {
            colVectors.push(this.multByVector(matrix.getCol(colIndex)));
        }

        return new Matrix(colVectors);
    }

    cpy() {
        return new Matrix(this.vectors.map(v => v.cpy()));
    }

    pow(n: Complex): Matrix {

        const [rows, cols] = this.dimensions();

        if (this.isDiagonal()) {
            const out = this.cpy();

            for (let i = 0; i < rows; i++) {
                out.set(i, i, this.get(i, i).pow(n));
            }

            return out;
        }

        try {
            const { P, D, invP } = this.diagonalize();
            return P.mul(D.pow(n)).mul(invP);
        } catch (e) {
            if (!n.isReal()) throw new Error("Complex exponent undefined for non diagonalizable matricies");

            const cursor = Number(n.realPart().floor());

            let accumulator = this.cpy(); // fix this shit
            const multiplicator = this.cpy();
            if (this.isSquare()) {
                for (let i = 0; i < cursor - 1; i++) {
                    accumulator = accumulator.mul(multiplicator); // super inefficient rn
                }
            }

            return accumulator;
        }


    }

    swapCol(idx1: number, idx2: number) {
        const matrix = this.cpy();
        if (idx1 === idx2) return matrix;
        const oldcol = matrix.vectors[idx1];
        matrix.vectors[idx1] = matrix.vectors[idx2];
        matrix.vectors[idx2] = oldcol;

        return matrix;
    }

    /**
     * Swaps the rows at idx1 and idx2
     *
     * @param {number} idx1 idx1 must be an integer. Index of the first row to be swapped.
     * @param {number} idx2 idx2 must be an integer. Index of the first row to be swapped.
     * @returns A new matrix with swapped rows
     */

    swapRow(idx1: number, idx2: number) {
        if (idx1 === idx2) return this.cpy();
        return this.T().swapCol(idx1, idx2).T();
    }

    multiplyRow(idx: number, scalar: Complex) {
        return new Matrix(this.vectors.map(v => v.set(idx, v.get(idx).mul(scalar))));
    }

    addRow(oldRow: number, rowToBeAdded: number) {
        return new Matrix(this.vectors.map(v => v.set(oldRow, v.get(oldRow).add(v.get(rowToBeAdded)))));
    }

    addMultRow(oldRow: number, rowToBeAdded: number, scalar: Complex) {
        return new Matrix(this.vectors.map(v => v.set(oldRow, v.get(oldRow).add(v.get(rowToBeAdded).mul(scalar)))));
    }

    // my own very brute force way of getting one eigenvalue, there's still ways to go but it'll do for now
    // a fun way would be to find one eigenvalue then divide the determinant function by (lambda - found eigenvalue)



    getEigenValues() { // we just kinda pray that eigenvalues are real

        if (!this.isSquare()) throw new Error("Can't find eigenvalues of non square matrix");

        const n = this.dimensions()[0];

        if (this.isTriangular()) {
            let eigenValues = [];
            for (let index = 0; index < n; index++) {
                eigenValues.push(this.get(index, index));
            }
            return eigenValues;
        }

        // uses this https://en.wikipedia.org/wiki/Power_iteration , my old algo is just stupid

        return powerIteration(this);
    }

    getRowSpaceBasis() {
        return basisFinder.findRowSpaceBasis(this);
    }

    getColumnSpaceBasis() {
        return basisFinder.findColSpaceBasis(this);
    }

    getNullSpaceBasis() {
        return basisFinder.findNullSpaceBasis(this);
    }

    getEigenSpaceBases() {
        let eigenSpaces = [];
        const eigenValues = this.getEigenValues();

        for (let i = 0; i < eigenValues.length; i++) {
            eigenSpaces.push({
                eigenValue: eigenValues[i],
                eigenSpaceBasis: basisFinder.findNullSpaceBasis(Matrix.getIdentityMatrixMultiple(this.dimensions()[0], eigenValues[i]).sub(this))
            })
        }
        return eigenSpaces;
    }

    diagonalize() {
        const eigenSpaces = this.getEigenSpaceBases();

        let basis = eigenSpaces.reduce((acc, curr) => acc.concat(curr.eigenSpaceBasis), Array<Vector>());

        basis = getUniqueVectors(basis);

        basis = basis.map(v => v.cpy());

        if (basis.length !== this.dimensions()[0]) throw new Error("Matrix is not diagonalizable");

        const P = new Matrix(basis);
        const invP = P.getInverse();
        const D = invP.mul(this).mul(P);


        return {
            P,
            invP,
            D
        }
    }

    decomposeQR() {
        return findQR(this);
    }

    trace() {
        let sum = Complex.ZERO;

        for (let i = 0; i < this.dimensions()[0]; i++) {
            sum = sum.add(this.get(i, i));
        }

        return sum;
    }

    toString() {

        if (this.vectors.length === 0) return "[[]]";

        let word = "";

        for (let i = 0; i < this.vectors[0].dimensions(); i++) {
            word += "[ ";
            for (let j = 0; j < this.vectors.length; j++) {
                word = word + ((j !== 0) ? ", " : "") + this.get(i, j).toString();

            }
            word += " ]\n";
        }

        return word;
    }

    getSubmatrixAlongFirstEntry() {
        return new Matrix(this.getVectors().slice(1).map(v => new Vector(v.coords().slice(1))));
    }

    static getCharacteristicPolyAt(lambda: Complex, matrix: Matrix) {
        if (!matrix.isSquare()) throw new Error("Can't find characteristic polynomial of non square matrix");

        let A = matrix;

        const n = A.dimensions()[0];

        let AminusLambda = A.sub(Matrix.getIdentityMatrixMultiple(n, lambda));

        return AminusLambda.getDeterminant();
    }

    static getIdentityMatrix(n: number) {

        let columnVectors = new Array(n);

        for (let i = 0; i < n; i++) {
            let columnVector = new Array(n);

            for (let j = 0; j < n; j++) {
                if (i === j) columnVector[j] = Complex.ONE;
                else columnVector[j] = Complex.ZERO;
            }
            columnVectors[i] = new Vector(columnVector);
        }

        return new Matrix(columnVectors);
    }

    static getIdentityMatrixMultiple(n: number, lambda: Complex) {
        let columnVectors = new Array(n);

        for (let i = 0; i < n; i++) {
            let columnVector = new Array(n);

            for (let j = 0; j < n; j++) {
                if (i === j) columnVector[j] = lambda;
                else columnVector[j] = Complex.ZERO;
            }
            columnVectors[i] = new Vector(columnVector);
        }

        return new Matrix(columnVectors);
    }

    /**
     *
     * @param {Function} f takes the row and column index as input and returns a number
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     */
    static fromCondition(f: (r: number, c: number) => Complex, rows: number, columns: number) {
        let vectors = [];
        for (let c = 0; c < columns; c++) {
            let entries = [];
            for (let r = 0; r < rows; r++) {
                entries.push(f(r, c));
            }
            vectors.push(new Vector(entries));
        }

        return new Matrix(vectors);
    }

    static randomIntMatrix(rows: number, columns: number, min = 0, max = 10) {
        return Matrix.fromCondition((i, j) => Complex.fromReal(BigFloat.fromNumber(min + Math.floor(Math.random() * (max - min + 1)))), rows, columns);
    }
}
