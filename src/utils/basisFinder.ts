import { Complex } from "../Complex";
import { Matrix } from "../Matrix";
import { Vector } from "../Vector";

export function findPivotRows(rref: Matrix) {
    const rowIndicies = [];
    const rows = rref.dimensions()[0];

    for (let i = 0; i < rows; i++) {
        const rowV = rref.getRow(i);

        if (!rowV.isZero()) rowIndicies.push(i);
    }
    return rowIndicies;
}

export function findPivotColumns(rref: Matrix) {
    const pivotRowsIndicies = findPivotRows(rref);

    const pivotColIndicies = [];
    const cols = rref.dimensions()[1];

    for (let i = 0; i < pivotRowsIndicies.length; i++) {
        const currentRow = rref.getRow(pivotRowsIndicies[i]);

        for (let j = 0; j < cols; j++) {
            const entry = currentRow.get(j);

            if (entry.equals(Complex.ONE)) {
                pivotColIndicies.push(j);
                j = cols;
            }
        }
    }

    return pivotColIndicies;
}

export function findRowSpaceBasis(m: Matrix) {
    const rref = m.getRref();
    const pivotRows = findPivotRows(rref);

    const basis = [];

    for (let i = 0; i < pivotRows.length; i++) {
        basis.push(rref.getRow(i));
    }
    return basis;
}

export function findColSpaceBasis(m: Matrix) {
    const rref = m.getRref();

    const pivotCols = findPivotColumns(rref);

    const basis = [];

    for (let i = 0; i < pivotCols.length; i++) {
        basis.push(m.getCol(pivotCols[i]));
    }
    return basis;
}

export function findNullSpaceBasis(m: Matrix) {
    if (m.getNulliy() === 0) return [];

    const transpose = m.T();

    const rref = transpose.getRref(); // B
    const reducedMatrix = transpose.getConversionMatrix(); // M

    const basis = [];
    const rows = rref.dimensions()[0];

    for (let i = 0; i < rows; i++) {
        if (rref.getRow(i).isZero()) {
            basis.push(reducedMatrix.getRow(i));
        }
    }

    return basis;
}

//from the last answer here https://math.stackexchange.com/questions/433932/equivalent-basis-of-a-subspace

export function spansSameSpace(basis1: Vector[], basis2: Vector[]) {
    const U = new Matrix(basis1);
    const V = new Matrix(basis2);

    const rankU = U.getRank();
    const rankV = V.getRank();

    if (rankU !== rankV) return false;

    const R = U.getRref();

    const convMat = U.getConversionMatrix().cpy();

    const VBar = convMat.mul(V);
    const rows = R.dimensions()[0];



    for (let i = 0; i < rows; i++) {
        if (R.getRow(i).isZero()) {
            if (!VBar.getRow(i).isZero()) return false;
        }
    }
    return true;
}

export default {
    findColSpaceBasis,
    findRowSpaceBasis,
    findNullSpaceBasis,
    spansSameSpace
}
