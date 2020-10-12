import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import rref from "./linalg/rref";


let C = new Matrix([
    new Vector([0, 2, 3]),
    new Vector([4, 9, 4]),
    new Vector([2, 5, 4]),
]);



console.log(rref(C).determinant);

/*
note to self:
test eigenvalue alg to avoid weird edge cases
// more testing pls
also do testing for new triangularity checks
*/