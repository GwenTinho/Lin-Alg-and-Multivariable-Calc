import binomialMatrixWOLast1 from "./binomialMatrixWOLast1"; // based off this video: https://www.youtube.com/watch?v=fw1kRz83Fj0&t=1409s

function negateEveryOtherEntry(matrix) {
    let [row, column] = matrix.getDimensions();
    const outMatrix = matrix.copyInstance();

    for (let c = 0; c < column; c++) {
        for (let r = 0; r < row; r++) {
            if ((c + r) % 2 == 1) outMatrix.negate(r, c);
        }
    }

    return outMatrix;
}

function bernoulli(n) {
    const binomialM = binomialMatrixWOLast1(n + 1);
    const negatedBinM = negateEveryOtherEntry(binomialM);

    negatedBinM.initValues();

    const bernoulliMatrix = negatedBinM.inverse.truncate(5);

    return bernoulliMatrix.T().getCol(0).coordinates;
}

export default bernoulli;