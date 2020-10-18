import Vector from "./Vector";
import newtonsMethod from "../helperFunctions/newtonsMethod";
import rootProduct from "../helperFunctions/rootProduct";
import rref from "./rref";

class Matrix {
    constructor(vectors) {
        this.errors = [];

        if (vectors.length !== 0) this.vectors = vectors; // matrix as array of column vectors
        else this.errors.push(new Error("empty vectors array"));

        this.det;
        this.inverse;
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
        this.rank = null;

        if (!this.isValidDimensional()) this.errors.push(new Error("invalid dimensions"));
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

    initValues() { // implement my own version

        if (this.isSquare()) this.symmetric = this.isEqual(this.T());

        const reducer = rref(this);

        this.rref = reducer.rref.copyInstance();

        this.det = reducer.determinant;
        this.inverse = (this.det === 0) ? null : reducer.conversionMatrix.copyInstance();
        this.orthogonal = (this.det === 0) ? false : this.isEqual(this.inverse.T());

        this.rank = this.rref.calcNonZeroRows();

        return this;
    }

    /**
     *  @returns {Matrix} the rref of this
     */

    getRref() {
        if (this.rref === null) {
            this.initValues();
            return this.rref;
        }
        return this.rref;
    }

    getNulliy() {
        return this.getDimensions()[1] - this.getRank();
    }

    getRank() {
        if (this.rank === null) {
            this.initValues();
            return this.rank;
        }
        return this.rank;
    }

    getInverse() {
        if (this.inverse === null) {
            this.initValues();
            return this.inverse;
        }
        return this.inverse;
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
        return new Vector([...this.vectors[col].coordinates])
    }

    getRow(row) {
        let coords = [];

        const nbrColumns = this.getDimensions()[1];

        for (let col = 0; col < nbrColumns; col++) {
            coords.push(this.get(row, col));
        }

        return new Vector(coords);
    }

    set(row, column, value) {
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

    getDimensions() { // row colomn
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

    isEqual(matrix) {
        if (!this.isSameDimensions(matrix)) return false;

        for (let i = 0; i < this.vectors.length; i++) {
            if (!this.vectors[i].isEqual(matrix.vectors[i])) return false;
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

        if (this.getDimensions()[1] !== matrix.getDimensions()[0]) return Matrix.getEmptyMatrix(); // check if they can be multiplied


        let colVectors = [];

        const columns = this.getDimensions()[1];

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



    getEigenValues() { // needs a lot more testing 
        if (!this.isSquare()) return [];

        const n = this.getDimensions()[0];
        const inital = 2;

        let eigenValues = []; // divide the characteristic poly fn through (lambda - previous eigenvalues) to remove those solutions.

        // breaks for complex solutions
        // next implement complex numbers
        // sometimes also breaks for other number idk really

        // if it is triangular the eigenvalues are the diagonal entries
        // this covers 3 cases upper lower triangularity and diagonal matricies

        if (this.isTriangular()) {
            for (let index = 0; index < n; index++) {
                eigenValues.push(this.get(index, index));
            }
            return eigenValues;
        }

        for (let index = 0; index < n; index++) {

            if (eigenValues.length == 0) {
                const eigenValue = newtonsMethod(lambda => Matrix.getCharacteristicPolyAt(lambda, this), inital, 1e-8, 10)
                eigenValues.push(eigenValue);
            } else {
                const eigenValue = newtonsMethod(lambda => (Matrix.getCharacteristicPolyAt(lambda, this) / rootProduct(lambda, eigenValues)), inital, 1e-8, 10)
                eigenValues.push(eigenValue);
            }
        }

        return eigenValues;
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

    static getCharacteristicPolyAt(lambda, matrix) {
        if (!matrix.isSquare()) return NaN;

        let A = matrix;

        const n = A.getDimensions()[0];

        let AminusLambda = A.sub(Matrix.getIdentityMatrixMultiple(n, lambda));

        AminusLambda.initValues();

        return AminusLambda.det;
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
}

export default Matrix;