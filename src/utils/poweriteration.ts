import { Complex } from "../Complex";
import { Matrix } from "../Matrix";
import { Vector } from "../Vector";

const iterations = 50;

/**
 * https://en.wikipedia.org/wiki/Power_iteration
 * @param {Matrix} matrix
 * @param {Number[]} eigenValues
 * @returns
 */
export function powerIteration(matrix: Matrix, eigenValues: Complex[] = [], depth = 0): Complex[] {
    debugger
    const n = matrix.dimensions()[0];
    let b_k = Vector.randomVector(n);

    for (let i = 0; i < iterations; i++) {
        let prod_A_b_k = matrix.multByVector(b_k);

        console.log(prod_A_b_k.norm());

        b_k = prod_A_b_k.divReal(prod_A_b_k.norm());
    }


    let eigenV = matrix.multByVector(b_k).findMultiplier(b_k).add(eigenValues.reduce((curr, acc) => acc = acc.add(curr), Complex.ZERO));
    eigenValues.push(eigenV);

    // TODO use identity that complex EV come in pairs

    if (depth === n - 1) return eigenValues;

    depth++;

    return powerIteration(matrix.sub(Matrix.getIdentityMatrixMultiple(n, eigenV)), eigenValues, depth);
}
