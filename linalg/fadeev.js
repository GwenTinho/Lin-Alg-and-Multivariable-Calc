import Matrix from "./Matrix";

/**
 * https://en.wikipedia.org/wiki/Faddeev%E2%80%93LeVerrier_algorithm + course notes MM
 *
 *
 * @param {Matrix} matrix
 */
function fadeev(matrix){
    if(!matrix.isSquare()) throw new Error("cannot apply fadeev to non square matrix");

    const n = matrix.getDimensions()[0]

    let p = Matrix.getIdentityMatrix(n);
    let a = -matrix.trace();

    const chracteristicPolyterms = [a];
    const auxMatricies = [p];

    let prevMult = p.mul(matrix);

    for (let i = 2; i <= n; i++) {
        p = prevMult.add(Matrix.getIdentityMatrixMultiple(n,a));
        prevMult = p.mul(matrix);
        a = (-1/i) * prevMult.trace();
        chracteristicPolyterms.push(a);
        auxMatricies.push(p);
    }

    return {
        chracteristicPolyterms,
        auxMatricies
    };
}

export default {
    fadeev
}
