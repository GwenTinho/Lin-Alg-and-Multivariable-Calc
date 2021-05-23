import { Complex } from "../Complex";
import { Matrix } from "../Matrix";
import { Vector } from "../Vector";

function getLastPivotRow(reducedMatrix: Matrix) {
    const rows = reducedMatrix.dimensions()[0];
    const columns = reducedMatrix.dimensions()[1];

    for (let currentRowIndex = 0; currentRowIndex < rows; currentRowIndex++) {
        // check if the current row is a 0 vector
        if (reducedMatrix.getRow(currentRowIndex).equals(Vector.zero(columns))) return currentRowIndex - 1;
    }

    return rows - 1;
}

function getPivotColumnInRow(reducedMatrix: Matrix, rowIndex: number) {
    const columns = reducedMatrix.dimensions()[1];

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        if (reducedMatrix.get(rowIndex, columnIndex).equals(Complex.ONE)) return columnIndex;
    }

    return -1;
}


export function rref(matrix: Matrix) {
    const rows = matrix.dimensions()[0];
    const columns = matrix.dimensions()[1];
    const isSquare = rows === columns;

    let reducedMatrix = matrix.cpy();
    let conversionMatrix = Matrix.getIdentityMatrix(rows);

    let determinant = isSquare ? Complex.ONE : Complex.ZERO;

    //Forward phase:

    // Step1: go through the entries of a column and check if its not all zeros, then swap rows if the first row of the column is 0 with the 1st non0 row.

    let currentPivotColumn = 0;
    let currentPivotRow = 0;

    while (currentPivotColumn < columns && currentPivotRow < rows) {

        const currentEntry = reducedMatrix.get(currentPivotRow, currentPivotColumn);

        if (currentEntry.isZero()) {
            let isFullOfZeros = true;

            for (let rowIndex = currentPivotRow; rowIndex < rows && isFullOfZeros; rowIndex++) {
                if (!reducedMatrix.get(rowIndex, currentPivotColumn).isZero()) {

                    reducedMatrix = reducedMatrix.swapRow(currentPivotRow, rowIndex);
                    conversionMatrix = conversionMatrix.swapRow(currentPivotRow, rowIndex);
                    determinant = determinant.neg();

                    isFullOfZeros = false;
                }
            }

            if (isFullOfZeros) {
                currentPivotColumn++;
                // skip the next 2.steps
                continue;
            }
        }

        // Step2: multiply the top row of the pivot column by a nonzero constant to make it a 1
        const scalar = reducedMatrix.get(currentPivotRow, currentPivotColumn);

        reducedMatrix = reducedMatrix.multiplyRow(currentPivotRow, scalar.inverse());
        conversionMatrix = conversionMatrix.multiplyRow(currentPivotRow, scalar.inverse());
        determinant = determinant.mul(scalar); // inverse row operation

        // Step3: Add suitable multiples of the top row to the other rows and make sure that all entreis apart from the pivot are 0

        for (let rowIndex = currentPivotRow + 1; rowIndex < rows; rowIndex++) {
            if (!reducedMatrix.get(rowIndex, currentPivotColumn).isZero()) {
                const scalar2 = reducedMatrix.get(rowIndex, currentPivotColumn).neg(); // bad naming

                reducedMatrix = reducedMatrix.addMultRow(rowIndex, currentPivotRow, scalar2);
                conversionMatrix = conversionMatrix.addMultRow(rowIndex, currentPivotRow, scalar2);
            }
        }

        currentPivotRow++;
    }

    //Backward phase

    // Step 1 find the first leading 1 from below

    let lastPivotRow = getLastPivotRow(reducedMatrix);
    let lastPivotColumn = getPivotColumnInRow(reducedMatrix, lastPivotRow);

    // next step, check if left above the value its 1 and the whole column 0, else find next pivot in row

    // Step 2 add a non0 multiple of that row to all the other rows above it

    while (lastPivotRow >= 0 && lastPivotColumn >= 0) {

        for (let rowIndex = lastPivotRow - 1; rowIndex >= 0; rowIndex--) {
            if (!reducedMatrix.get(rowIndex, lastPivotColumn).isZero()) {
                const scalar3 = reducedMatrix.get(rowIndex, lastPivotColumn).neg();

                reducedMatrix = reducedMatrix.addMultRow(rowIndex, lastPivotColumn, scalar3);
                conversionMatrix = conversionMatrix.addMultRow(rowIndex, lastPivotColumn, scalar3);
            }
        }
        lastPivotRow--;
        if (lastPivotRow >= 0) lastPivotColumn = getPivotColumnInRow(reducedMatrix, lastPivotRow);
    }

    return { rref: reducedMatrix, conversionMatrix, determinant };
}
