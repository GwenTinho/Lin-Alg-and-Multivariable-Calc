import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import operators from "./linalg/operators";
import print from "./helperFunctions/print";
import basisFinder from "./linalg/basisFinder";
import gramSchmidt from "./linalg/gramSchmidt";

try {
    let vectorSet = [
        new Vector([6, 2, -2, 6]),
        new Vector([1, 1, -2, 8]),
        new Vector([-5, 1, 5, -7])
    ]

    print(gramSchmidt.gramSchmidt(vectorSet));
} catch (error) {
    console.log("\n\n" + error.stack + "\n\n");
}



/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
