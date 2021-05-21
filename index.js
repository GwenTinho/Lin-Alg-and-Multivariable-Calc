import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import operators from "./linalg/operators";
import print from "./helperFunctions/print";
import basisFinder from "./linalg/basisFinder";
import gramSchmidt from "./linalg/gramSchmidt";

try {
    let v = new Vector([1, 0]);

    let P = new Matrix([
        new Vector([0, 0.5, 0.5]),
        new Vector([0, 1, 0]),
        new Vector([1, 0, 0]),
    ]);

    print(P.pow(100).multByVector(v));
} catch (error) {
    console.log("\n\n" + error.stack + "\n\n");
}



/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
