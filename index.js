import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import operators from "./linalg/operators";
import print from "./helperFunctions/print";

let A = new Matrix([
    new Vector([2, 1, 4]),
    new Vector([1, -1, 3]),
    new Vector([3, 2, 5])
]);

let v = new Vector([3, 2]);
let rotV = operators.rotateCCL2D(v, Math.PI);

print(v);
print(rotV);
print(operators.rotateCCL2D(rotV, Math.PI));

/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
