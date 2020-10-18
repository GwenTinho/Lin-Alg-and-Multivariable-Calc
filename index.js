import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";

let A = new Matrix([
    new Vector([2, 0, 0]),
    new Vector([-1, 1, 0]),
    new Vector([3, 2, 4]),
]);

let B = new Matrix([new Vector([1, 0, -2])])



console.log((new EquationSolver(A, B)).solve().toString());

/*
note to self:
test eigenvalue alg to avoid weird edge cases
// more testing pls
also do testing for new triangularity checks
*/