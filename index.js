import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import operators from "./linalg/operators";
import print from "./helperFunctions/print";
import basisFinder from "./linalg/BasisFinder";

let A = new Matrix([
    new Vector([1, -3, 2]),
    new Vector([-2, 6, -4]),
    new Vector([2, -1, 5]),
    new Vector([3, 1, 8]),
    new Vector([-1, -7, -4])
]);

const colSpace = basisFinder.findColSpaceBasis(A);
const rowSpace = basisFinder.findRowSpaceBasis(A);

for (let i = 0; i < colSpace.length; i++) {
    print(colSpace[i]);
}

for (let i = 0; i < rowSpace.length; i++) {
    print(rowSpace[i]);
}

/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
