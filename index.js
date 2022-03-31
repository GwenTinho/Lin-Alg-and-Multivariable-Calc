import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";
import operators from "./linalg/operators";
import print from "./helperFunctions/print";
import basisFinder from "./linalg/basisFinder";
import gramSchmidt from "./linalg/gramSchmidt";
import fadeev from "./linalg/fadeev";
import StateSpaceSystem from "./stateSpaceSystems/StateSpaceSystem";

try {
    const ss = new StateSpaceSystem(
        new Matrix([
            new Vector([-7,-1,-17]),
            new Vector([-8,-1,-16]),
            new Vector([2,-1,-1]),
        ]),
        new Matrix([
            new Vector([-30,23,-8])
        ]),
        new Matrix([
            new Vector([1]),
            new Vector([1]),
            new Vector([0]),
        ]),
        new Matrix([
            new Vector([1])
        ])
    );

    const Wc = ss.controllability();

    print(Wc);
    print(Wc.getDeterminant());
} catch (error) {
    console.log("\n\n" + error.stack + "\n\n");
}



/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
