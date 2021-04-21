import Vector from "./Vector";
import rref from "./rref";
import powerIteration from "./powerIteration";
import basisFinder from "./basisFinder";
import gramSchmidt from "./gramSchmidt";

class Matrix {
    constructor(vectors) {

        if (vectors.length !== 0) this.vectors = vectors; // matrix as array of column vectors
        else throw new Error("empty vectors array");

        this.det = null;
        this.inverse = null;
        this.rref;
        this.orthogonal;
        this.symmetric;
        this.diagonal = null;
        this.upperTriangular = null;
        this.lowerTriangular = null;
        this.triangular = null;
        this.validDimensional = null;
        this.rref = null;
        this.inverse = null;
        this.conversionMatrix = null;
        this.rank = null;
        this.initialized = false;

        if (!this.isValidDimensional()) throw new Error("invalid dimensions");
    }

    /**
     * @returns {Vector[]} a array of column vectors
     */
    getVectors() {
        return this.copyInstance().vectors;
    }

    isValidDimensional() {
        if (this.validDimensional == null) {
            const comp = this.vectors[0].getDimension();

            for (let index = 0; index < this.vectors.length; index++) {
                if (comp != this.vectors[index].getDimension()) {
                    this.validDimensional = false;
                    return false;
                }
            }
            this.validDimensional = true;
            return true;
        }
        return this.validDimensional;
    }

    multByVector(vector) {
        let coords = [];

        const rows = this.getDimensions()[0];

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            coords.push(this.getRow(rowIndex).dot(vector));
        }

        return new Vector(coords);
    }

    wrapToScalar(vector) { // (x^T)Ax = x.Ax = Ax.x
        return this.multByVector(vector).dot(vector);
    }

    multByReal(number) {
        return new Matrix(this.copyInstance().vectors.map(vector => vector.mult(number)));
    }

    initValues() {

        if (this.initialized) return this;

        if (this.isSquare()) this.symmetric = this.isEqual(this.T());

        const reducer = rref(this);

        this.rref = reducer.rref.copyInstance();

        this.det = reducer.determinant;
        if (this.det !== 0) {
            this.inverse = reducer.conversionMatrix.copyInstance();
            this.conversionMatrix = reducer.conversionMatrix.copyInstance();
        }
        else {
            this.inverse = null;
            this.conversionMatrix = reducer.conversionMatrix.copyInstance();
        }
        this.orthogonal = (this.det === 0) ? false : this.isEqual(this.inverse.T());

        this.rank = this.rref.calcNonZeroRows();
        this.initialized = true;

        return this;
    }

    /**
     *  @returns {Matrix} the rref of this
     */

    getRref() {
        if (this.rref === null) {
            this.initValues();
        }
        return this.rref;
    }

    getNulliy() {
        return this.getDimensions()[1] - this.getRank();
    }

    getRank() {
        if (this.rank === null) {
            this.initValues();
        }
        return this.rank;
    }

    getInverse() {
        if (this.inverse === null) {
            this.initValues();
        }
        return this.inverse;
    }

    getConversionMatrix() {
        if (this.conversionMatrix === null) {
            this.initValues();
        }
        return this.conversionMatrix;
    }

    getDeterminant() {
        if (this.det === null) {
            this.initValues();
        }
        return this.det;
    }

    isOrthogonal() {
        return this.orthogonal;
    }

    isSymmetric() {
        return this.symmetric;
    }

    isUpperTriangular() {
        if (!this.isSquare()) return false;
        if (typeof this.upperTriangular === "boolean") return this.upperTriangular;

        const size = this.getDimensions()[0];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i > j && this.get(i, j) !== 0) {
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

        const size = this.getDimensions()[0];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i < j && this.get(i, j) !== 0) {
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

        const size = this.getDimensions()[0];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i !== j && this.get(i, j) !== 0) {
                    this.diagonal = false;
                    return false;
                }
            }
        }
        this.diagonal = true;
        return true;
    }

    isPositiveDefinite() {
        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index] <= 0) return false;
        }

        return true;
    }

    isPositiveSemiDefinite() {
        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index] < 0) return false;
        }

        return true;
    }

    isNegativeDefinite() {
        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index] >= 0) return false;
        }

        return true;
    }

    isNegativeSemiDefinite() {
        const eigenV = this.getEigenValues();

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index] > 0) return false;
        }

        return true;
    }

    isNonDefinite() { // one of each (atleast 1 neg and 1 pos) (needed to decide if function has a saddle point)
        const eigenV = this.getEigenValues();
        let count = 0;

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index] > 0) {
                count++;
                break;
            }
        }

        for (let index = 0; index < eigenV.length; index++) {
            if (eigenV[index] < 0) {
                count++;
                break;
            }
        }

        return count === 2;
    }

    get(row, column) {
        return this.vectors[column].coordinates[row];
    }

    getCol(col) {
        if (col >= 0 && col < this.getDimensions()[1]) return new Vector([...this.vectors[col].coordinates]);
        throw new Error("Invalid column index in getCol: " + col);
    }

    getRow(row) {
        if (row >= 0 && row < this.getDimensions()[0]) {
            let coords = [];

            const nbrColumns = this.getDimensions()[1];

            for (let col = 0; col < nbrColumns; col++) {
                coords.push(this.get(row, col));
            }

            return new Vector(coords);
        }
        throw new Error("Invalid row index in getRow: " + row);
    }

    set(row, column, value) { // implement better error handling
        this.vectors[column].set(row, value);
    }

    negate(row, column) {
        this.vectors[column].negate(row);
    }

    truncate(n) {
        let [rows, cols] = this.getDimensions();
        let outM = this.copyInstance();

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const val = this.get(r, c);
                outM.set(r, c, Math.floor(val * 10 ** n) / 10 ** n);
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

    getDimensions() { // row column
        return [this.vectors[0].getDimension(), this.vectors.length];
    }

    calcNonZeroRows() {
        const rows = this.getDimensions()[0];
        const columns = this.getDimensions()[1];
        let counter = 0;

        for (let index = 0; index < rows; index++) {
            if (this.getRow(index).isEqual(Vector.zero(columns))) counter++;
        }

        return rows - counter;
    }

    isSameDimensions(matrix) {
        const dim1 = this.getDimensions();
        const dim2 = matrix.getDimensions();

        return dim1[0] === dim2[0] && dim1[1] === dim2[1];
    }

    isSquare() {
        const dim = this.getDimensions();

        return dim[0] === dim[1];
    }

    /**
     *
     * @param {Matrix} Matrix Matrix that we compare against
     * @param {number} maxError maximum margin of error (Defaults to 1e-6)
     * @returns {Boolean} true if the absolute difference between each entry is within the maxError
     */
    isEqual(matrix, maxError = 1e-6) {
        if (!this.isSameDimensions(matrix)) return false;

        for (let i = 0; i < this.vectors.length; i++) {
            if (!this.vectors[i].isEqual(matrix.vectors[i], maxError)) return false;
        }

        return true;
    }

    T() {
        let matrix = this.copyInstance();
        let dims = matrix.getDimensions();
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

    add(matrix) {
        return new Matrix(this.copyInstance().vectors.map((vector, i) => vector.add(matrix.vectors[i])));
    }

    sub(matrix) {
        return new Matrix(this.copyInstance().vectors.map((vector, i) => vector.sub(matrix.vectors[i])));
    }

    mul(matrix) {

        if (this.getDimensions()[1] !== matrix.getDimensions()[0]) throw new Error("Dimensions don't match: A: [" + this.getDimensions() + "] B: [" + matrix.getDimensions() + "]"); // check if they can be multiplied


        let colVectors = [];

        const columns = matrix.getDimensions()[1];

        for (let colIndex = 0; colIndex < columns; colIndex++) {
            colVectors.push(this.multByVector(matrix.getCol(colIndex)));
        }

        return new Matrix(colVectors);
    }

    copyInstance() {
        let vectors = [];

        this.vectors.forEach(vector => vectors.push(new Vector([...vector.coordinates])));

        return new Matrix(vectors);
    }

    pow(n) {
        let accumulator = this.copyInstance();
        let multiplicator = this.copyInstance();
        if (this.isSquare()) {
            for (let i = 0; i < n - 1; i++) {
                accumulator = accumulator.mul(multiplicator);
            }
        }

        return accumulator;
    }

    swapCol(idx1, idx2) {
        const matrix = this.copyInstance();
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

    swapRow(idx1, idx2) {
        if (idx1 === idx2) return this.copyInstance();
        return this.T().swapCol(idx1, idx2).T();
    }

    multiplyRow(idx, scalar) {
        const matrix = this.copyInstance();

        for (let i = 0; i < matrix.vectors.length; i++) {
            matrix.vectors[i].coordinates[idx] *= scalar;
        }

        return matrix;
    }

    addRow(oldRow, rowToBeAdded) {
        const matrix = this.copyInstance();

        for (let i = 0; i < matrix.vectors.length; i++) {
            matrix.vectors[i].coordinates[oldRow] += matrix.vectors[i].coordinates[rowToBeAdded];
        }

        return matrix;
    }

    addMultRow(oldRow, rowToBeAdded, scalar) {
        const matrix = this.copyInstance();

        for (let i = 0; i < matrix.vectors.length; i++) {
            matrix.vectors[i].coordinates[oldRow] += matrix.get(rowToBeAdded, i) * scalar;
        }

        return matrix;
    }

    // my own very brute force way of getting one eigenvalue, there's still ways to go but it'll do for now
    // a fun way would be to find one eigenvalue then divide the determinant function by (lambda - found eigenvalue)



    getEigenValues() { // we just kinda pray that eigenvalues are real

        if (!this.isSquare()) throw new Error("Can't find eigenvalues of non square matrix");

        const n = this.getDimensions()[0];

        if (this.isTriangular()) {
            let eigenValues = [];
            for (let index = 0; index < n; index++) {
                eigenValues.push(this.get(index, index));
            }
            return eigenValues;
        }

        // uses this https://en.wikipedia.org/wiki/Power_iteration , my old algo is just stupid

        return powerIteration.powerIteration(this);
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
                eigenSpaceBasis: basisFinder.findNullSpaceBasis(Matrix.getIdentityMatrixMultiple(this.getDimensions()[0], eigenValues[i]).sub(this))
            })
        }
        return eigenSpaces;
    }

    diagonalize() {
        const eigenSpaces = this.getEigenSpaceBases();

        let basis = eigenSpaces.reduce((acc, curr) => acc.concat(curr.eigenSpaceBasis), []);

        basis = Array.from(new Set(basis.map(JSON.stringify)), JSON.parse);

        basis = basis.map(arr => new Vector(arr.coordinates));

        if (basis.length !== this.getDimensions()[0]) throw new Error("Matrix is not diagonalizable");



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
        return gramSchmidt.findQR(this);
    }

    trace() {
        let sum = 0;

        for (let i = 0; i < this.getDimensions()[0]; i++) {
            sum += this.get(i, i);
        }

        return sum;
    }

    toString() {

        if (this.vectors.length === 0) return "[[]]";

        let word = "";

        for (let i = 0; i < this.vectors[0].getDimension(); i++) {
            word += "[ ";
            for (let j = 0; j < this.vectors.length; j++) {
                word = word + ((j !== 0) ? ", " : "") + this.get(i, j);

            }
            word += " ]\n";
        }

        return word;
    }

    getSubmatrixAlongFirstEntry() {
        return new Matrix(this.getVectors().slice(1).map(v => new Vector(v.getCoordinates().slice(1))));
    }

    static getCharacteristicPolyAt(lambda, matrix) {
        if (!matrix.isSquare()) throw new Error("Can't find characteristic polynomial of non square matrix");

        let A = matrix;

        const n = A.getDimensions()[0];

        let AminusLambda = A.sub(Matrix.getIdentityMatrixMultiple(n, lambda));

        return AminusLambda.getDeterminant();
    }

    static getIdentityMatrix(n) {

        let columnVectors = new Array(n);

        for (let i = 0; i < n; i++) {
            let columnVector = new Array(n);

            for (let j = 0; j < n; j++) {
                if (i === j) columnVector[j] = 1;
                else columnVector[j] = 0;
            }
            columnVectors[i] = new Vector(columnVector);
        }

        return new Matrix(columnVectors);
    }

    static getIdentityMatrixMultiple(n, lambda) {
        let columnVectors = new Array(n);

        for (let i = 0; i < n; i++) {
            let columnVector = new Array(n);

            for (let j = 0; j < n; j++) {
                if (i === j) columnVector[j] = lambda;
                else columnVector[j] = 0;
            }
            columnVectors[i] = new Vector(columnVector);
        }

        return new Matrix(columnVectors);
    }

    static fastDet2d(arr1, arr2) {
        return arr1[0] * arr2[1] - arr1[1] * arr2[0];
    }

    static getEmptyMatrix() {
        return new Matrix([]);
    }

    /**
     *
     * @param {Function} f takes the row and column index as input and returns a number
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     */
    static fromCondition(f, rows, columns) {
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

    static randomIntMatrix(rows, columns, min = 0, max = 10) {
        return Matrix.fromCondition((i, j) => min + Math.floor(Math.random() * (max - min + 1)), rows, columns);
    }
}

export default Matrix;
