import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import operators from "./linalg/operators";
import print from "./helperFunctions/print";
import basisFinder from "./linalg/basisFinder";
import gramSchmidt from "./linalg/gramSchmidt";
import fadeev from "./linalg/fadeev";

try {
    const A = new Matrix([
        new Vector([0,1,0]),
        new Vector([0,0,1]),
        new Vector([2,1,3])
    ]);

    print(fadeev.fadeev(A).auxMatricies);
} catch (error) {
    console.log("\n\n" + error.stack + "\n\n");
}



/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
