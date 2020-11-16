import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";

let A = new Matrix([
    new Vector([-2, 3, 1]),
    new Vector([1, 5, 6]),
    new Vector([4, -7, 2]),
]);

console.log(A.getDeterminant());

/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/