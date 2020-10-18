import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";
import EquationSolver from "./linalg/EquationSolver";
import InverseTester from "./unitTests/InverseTester";

console.log((new InverseTester(100000, 3, 1e-4)).run());
/*
note to self:
test eigenvalue alg to avoid weird edge cases
// more testing pls
also do testing for new triangularity checks
*/