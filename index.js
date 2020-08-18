import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


let f = new Mfunction(2, 2,
    v => new Vector(
        [
            v.get(0) * v.get(1),
            v.get(1) ** 2 - v.get(0) ** 2
        ])
);

f.initJacobian()

console.log(f.getDivergence(new Vector([0, -4])));