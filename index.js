import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


let f = new Mfunction(2, 2,
    v => new Vector([
        v.get(0) + Math.sin(v.get(1)),
        v.get(1) + Math.sin(v.get(0))
    ])
);

console.log(f.getJacobianDetAt(new Vector([0, 1])));