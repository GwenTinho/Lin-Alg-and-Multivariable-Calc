import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


let f = new Mfunction(2, 1,
    v => 3 * v.get(0) ** 2 * v.get(1) - v.get(1) ** 3 - 3 * v.get(0) ** 2 - 3 * v.get(1) ** 2
);

console.log(f.hasMaximumAt(new Vector([0, 0])));
console.log(f.hasSaddleAt(new Vector([0, -2])));
console.log(f.hasSaddleAt(new Vector([Math.sqrt(3), 1])));
console.log(f.hasSaddleAt(new Vector([-Math.sqrt(3), 1])));

/*

note to self:
test eigenvalue alg to avoid weird edge cases

*/