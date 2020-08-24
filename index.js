import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


let f = new Mfunction(2, 1,
    v => v.get(0) ** 2 - v.get(1) ** 2
);

console.log(f.hasMinimumAt(new Vector([0, 0])));