import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


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
*/