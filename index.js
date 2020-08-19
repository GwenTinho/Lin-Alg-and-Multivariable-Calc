import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


let f = new Mfunction(3, 3,
    v => new Vector(
        [
            v.get(0) * v.get(1),
            Math.cos(v.get(2)),
            v.get(2) ** 2 + v.get(1)
        ])
);

console.log(f.getCurl(new Vector([3, 10, 0])));

// would expect (1,0,-3) --> works fine