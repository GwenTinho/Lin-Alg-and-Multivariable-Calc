import Vector from "./Vector";
import Matrix from "./Matrix";

/**
 * Get the last pivot index apart from the ones already covered
 * 
 * @param {Matrix} reducedMatrix a matrix in ref
 * @returns {number} returns a row index
 */

function getLastPivotRow(reducedMatrix) {
    const rows = reducedMatrix.getDimensions()[0];
    const columns = reducedMatrix.getDimensions()[1];

    for (let currentRowIndex = 0; currentRowIndex < rows; currentRowIndex++) {
        // check if the current row is a 0 vector
        if (reducedMatrix.getRow(currentRowIndex).isEqual(Vector.zero(columns))) return currentRowIndex - 1;
    }

    return rows - 1;
}

function getPivotColumnInRow(reducedMatrix, rowIndex) {
    const columns = reducedMatrix.getDimensions()[1];

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        if (reducedMatrix.get(rowIndex, columnIndex) == 1) return columnIndex;
    }

    return -1;
}


/**
 * Turns a matrix to its rref
 * 
 * @param {Matrix} matrix A mxn matrix to be reduced
 * @return {{rref,conversionMatrix,determinant}} an object holding the rref, conversion matrix and the determinant
 */

function rref(matrix) {

    const rows = matrix.getDimensions()[0];
    const columns = matrix.getDimensions()[1];
    const isSquare = rows === columns;

    let reducedMatrix = matrix.copyInstance();
    let conversionMatrix = Matrix.getIdentityMatrix(rows);

    let determinant = isSquare ? 1 : 0;

    //Forward phase:

    // Step1: go through the entries of a column and check if its not all zeros, then swap rows if the first row of the column is 0 with the 1st non0 row.

    let currentPivotColumn = 0;
    let currentPivotRow = 0;

    while (currentPivotColumn < columns && currentPivotRow < rows) {

        const currentEntry = reducedMatrix.get(currentPivotRow, currentPivotColumn);

        if (currentEntry === 0) {
            let isFullOfZeros = true;

            for (let rowIndex = currentPivotRow; rowIndex < rows && isFullOfZeros; rowIndex++) {
                if (reducedMatrix.get(rowIndex, currentPivotColumn) !== 0) {

                    reducedMatrix = reducedMatrix.swapRow(currentPivotRow, rowIndex);
                    conversionMatrix = conversionMatrix.swapRow(currentPivotRow, rowIndex);
                    determinant *= -1;

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

        reducedMatrix = reducedMatrix.multiplyRow(currentPivotRow, 1 / scalar);
        conversionMatrix = conversionMatrix.multiplyRow(currentPivotRow, 1 / scalar);
        determinant *= scalar;

        // Step3: Add suitable multiples of the top row to the other rows and make sure that all entreis apart from the pivot are 0

        for (let rowIndex = currentPivotRow + 1; rowIndex < rows; rowIndex++) {
            if (reducedMatrix.get(rowIndex, currentPivotColumn) !== 0) {
                reducedMatrix = reducedMatrix.addMultRow(rowIndex, currentPivotRow, -reducedMatrix.get(rowIndex, currentPivotColumn));
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
            if (reducedMatrix.get(rowIndex, lastPivotColumn) !== 0) {
                reducedMatrix = reducedMatrix.addMultRow(rowIndex, lastPivotColumn, -reducedMatrix.get(rowIndex, lastPivotColumn));
            }
        }

        lastPivotRow--;
        lastPivotColumn = getPivotColumnInRow(reducedMatrix, lastPivotRow);
    }


    for (let i = 0; i < rows && determinant !== 0; i++) {
        determinant *= reducedMatrix.get(i, i);
    }

    return { rref: reducedMatrix, conversionMatrix, determinant };
}

export default rref;