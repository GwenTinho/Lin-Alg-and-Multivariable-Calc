import Matrix from "../Matrix";
import Vector from "../Vector";

function add0sUpTo(arr, n) {
    if (n >= arr.length) return arr.concat((new Array(n - arr.length)).fill(0));
}

function binomialMatrixWOLast1(n) {
    const binomials = [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
        [1, 5, 10, 10, 5, 1],
    ];

    // step 2: a function that builds out the LUT if it needs to. // from this post https://stackoverflow.com/questions/37679987/efficient-computation-of-n-choose-k-in-node-js

    while (n >= binomials.length) {
        let s = binomials.length;
        let nextRow = [];
        nextRow[0] = 1;
        for (let i = 1, prev = s - 1; i < s; i++) {
            nextRow[i] = binomials[prev][i - 1] + binomials[prev][i];
        }
        nextRow[s] = 1;
        binomials.push(nextRow);
    }

    let binomialVectors = binomials.splice(0, n).map(arr => {
        arr.pop();
        return new Vector(add0sUpTo(arr, n - 1));
    });

    binomialVectors.shift();

    return new Matrix(binomialVectors);
}

export default binomialMatrixWOLast1;