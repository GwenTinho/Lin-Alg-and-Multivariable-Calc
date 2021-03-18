import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import operators from "./linalg/operators";
import print from "./helperFunctions/print";
import basisFinder from "./linalg/BasisFinder";

try {
    let A = new Matrix([
        new Vector([0, 1, 1]),
        new Vector([0, 2, 0]),
        new Vector([-2, 1, 3])
    ]);

    const diagonalized = A.diagonalize();

    print(diagonalized.P.toString());
    print(diagonalized.D.toString());
    print(diagonalized.invP.toString());
} catch (error) {
    console.log("\n\n" + error.message + "\n\n");
}



/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
