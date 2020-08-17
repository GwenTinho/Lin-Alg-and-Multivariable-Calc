import Vector from "./Vector";
import newtonsMethod from "./helperFunctions/newtonsMethod";
import rootProduct from "./helperFunctions/rootProduct";

class Matrix {
    constructor(vectors) {
        this.vectors = vectors; // matrix as array of column vectors

        this.det;
        this.inverse;
        this.rref;
        this.isOrthogonal;
    }

    multByVector(vector) {
        let coords = [];

        for (let i = 0; i < this.vectors.length; i++) {
            coords.push(this.vectors[i].dot(vector));
        }

        return new Vector(coords);
    }

    multByReal(number) {
        return new Matrix(this.copyInstance().vectors.map(vector => vector.mult(number)));
    }

    initValues() {
        const dims = this.getDimensions();
        const rows = dims[0];
        const columns = dims[1];

        let rref = this.copyInstance();
        let iden = Matrix.getIdentityMatrix(rows);

        let factors = 1;
        let lead = 0;

        for (let r = 0; r < rows; r++) {
            if (columns <= lead) {
                this.rref = Matrix.getEmptyMatrix();
                this.det = 0;
                this.inverse = Matrix.getEmptyMatrix();
                return;
            }
            let i = r;
            while (rref.get(i, lead) === 0) {
                i++;
                if (rows == i) {
                    i = r;
                    lead++;
                    if (columns == lead) {
                        this.rref = Matrix.getEmptyMatrix();
                        this.det = 0;
                        this.inverse = Matrix.getEmptyMatrix();
                        return;
                    }
                }
            }

            rref = rref.swapRow(i, r);
            iden = iden.swapRow(i, r);

            let val = rref.get(r, lead);

            rref = rref.multiplyRow(r, 1 / val);
            iden = iden.multiplyRow(r, 1 / val);

            factors *= -val;

            for (let i = 0; i < rows; i++) {
                if (i == r) continue;
                val = rref.get(i, lead);

                rref = rref.addMultRow(i, r, -val);
                iden = iden.addMultRow(i, r, -val);
            }
            lead++;
        }

        let accumulator = factors;

        for (let i = 0; i < columns; i++) {
            accumulator *= rref.get(i, i);
        }

        this.rref = rref;
        this.det = accumulator;
        this.inverse = (this.det == 0) ? Matrix.getEmptyMatrix() : iden;
        this.isOrthogonal = this.isEqual(this.inverse.T());
        return this;
    }

    get(row, column) {
        return this.vectors[column].coordinates[row];
    }

    getCol(col) {
        return new Vector([...this.vectors[col].coordinates])
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

    getDimensions() { // row colomn
        return [this.vectors[0].getDimension(), this.vectors.length];
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
        let rowVectors = [];

        for (let i = 0; i < matrix.vectors[0].getDimension(); i++) { // rows
            let coords = [];

            for (let j = 0; j < matrix.vectors.length; j++) { // columns
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

        let transpose = this.T();

        let colVectors = [];

        for (let i = 0; i < this.vectors.length; i++) {
            colVectors.push(transpose.multByVector(matrix.vectors[i]));
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



    getEigenValues() {
        if (!this.isSquare()) return [];

        const n = this.getDimensions()[0];
        const inital = 2;

        let eigenValues = []; // divide the characteristic poly fn through (lambda - previous eigenvalues) to remove those solutions.

        // breaks for complex solutions

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