import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


let f = new Mfunction(2, 1,
    v => 3 + Math.cos(v.get(0) / 2) * Math.sin(v.get(1) / 2)
);

console.log(f.getHessianAt(new Vector([3.14, 3.14])).toString());

// would expect -0.125 --> works fine