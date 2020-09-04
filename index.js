import Vector from "./linalg/Vector";
import Matrix from "./linalg/Matrix";


let M1 = new Matrix([
    new Vector([4, -14, -12]),
    new Vector([-14, 10, 13]),
    new Vector([-12, 13, 1])
]);

console.log(M1.getEigenValues());

/*
note to self:
test eigenvalue alg to avoid weird edge cases
// more testing pls
also do testing for new triangularity checks
*/