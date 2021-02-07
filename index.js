import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import print from "./helperFunctions/print";

let A = new Matrix([
    new Vector([2, 1, 4]),
    new Vector([1, -1, 3]),
    new Vector([3, 2, 5]),
    new Vector([-9, -7, -15]),
    new Vector([6, 11, 6]),
    new Vector([0, 0, 0]),
    new Vector([7, 8, 9]),
]);

print(A.getRref());

/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/