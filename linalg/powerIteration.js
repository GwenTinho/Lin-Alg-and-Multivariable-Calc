import Matrix from "./Matrix";
import Vector from "./Vector";

const iterations = 50;

/**
 * https://en.wikipedia.org/wiki/Power_iteration
 * @param {Matrix} matrix
 * @param {Number[]} eigenValues
 * @returns
 */
function powerIteration(matrix, eigenValues = [], depth = 0) {
  const n = matrix.getDimensions()[0];
  let b_k = Vector.randomVector(n);

  for (let i = 0; i < iterations; i++) {
    let prod_A_b_k = matrix.multByVector(b_k);
    b_k = prod_A_b_k.mult(1 / prod_A_b_k.getNorm());
  }


  let eigenV = matrix.multByVector(b_k).findMultiplier(b_k) + eigenValues.reduce((curr, acc) => acc += curr, 0);
  //ill round for now
  eigenV = Math.round(eigenV * 1e8) * 1e-8
  eigenValues.push(eigenV);

  if (depth === n - 1) return eigenValues;

  depth++;

  return powerIteration(matrix.sub(Matrix.getIdentityMatrixMultiple(n, eigenV)), eigenValues, depth);
}

export default {
  powerIteration
}
