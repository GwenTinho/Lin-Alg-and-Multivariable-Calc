import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";


let C = new Matrix([
    new Vector([1, 3]),
    new Vector([4, 1]),
    new Vector([2, 5])
]);

let D = new Matrix([
    new Vector([1, -1, 3]),
    new Vector([5, 0, 2]),
    new Vector([2, 1, 4])
]);

let E = new Matrix([
    new Vector([6, -1, 4]),
    new Vector([1, 1, 1]),
    new Vector([5, 1, 3])
])

console.log(D.mul(E.T()).trace());

/*
note to self:
test eigenvalue alg to avoid weird edge cases
// more testing pls
also do testing for new triangularity checks
*/

// test