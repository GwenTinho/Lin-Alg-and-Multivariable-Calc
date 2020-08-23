import Vector from "./Vector";
import Matrix from "./Matrix";
import Line from "./Line";
import Point from "./Point";
import Plane from "./Plane";
import Triangle from "./triangle";
import bernoulli from "./bernoulli/bernoulli";
import Mfunction from "./multivariable/Mfunction";


let f = new Mfunction(2, 1,
    v => Math.exp(v.get(0) / 2) * Math.sin(v.get(1))
);

let linAppr = f.getLocalLinearization(new Vector([0, Math.PI / 2]));

console.log(linAppr.calc(new Vector([0, Math.PI / 2])));

console.log(f.calc(new Vector([0, Math.PI / 2])));

let tanPlane = f.getTangentPlane(new Vector([0, Math.PI / 2]));

console.log(tanPlane);