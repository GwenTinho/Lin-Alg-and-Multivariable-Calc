import Point from "./Point";
import Vector from "./Vector";
import Matrix from "./Matrix";

class Line {
    constructor(point, vector) {
        this.point = point;
        this.vector = vector;
    }

    isOnLine(point) {
        if (this.vector.getDimension() !== this.point.getDimension()) return false;

        let cmpArray = [];

        for (let i = 0; i < this.vector.getDimension(); i++) {
            let t = (point.coordinates[i] - this.point.coordinates[i]) / this.vector.coordinates[i];
            cmpArray.push(t);
        }

        return cmpArray.every(t => t === cmpArray[0]);
    }

    getPointAtT(t) {
        let coords = [];

        for (let i = 0; i < this.vector.getDimension(); i++) {
            let pos = t * this.vector.coordinates[i] + this.point.coordinates[i];
            coords.push(pos);
        }

        return new Point(coords);
    }

    isParallel(line) {
        return Vector.checkAligned(this.vector, line.vector);
    }

    isCoplanar(line) {
        let v1 = this.vector;
        let v2 = line.vector;
        let v3 = Vector.fromPoints(this.point, line.point);

        let m = new Matrix([v1, v2, v3]);

        return m.det() === 0;
    }

    // implementation of this code https://blackpawn.com/texts/pointinpoly/default.html
    /*
    it is never explained why p1 and p2 are needed for his function though 
    it is somewhat obvious that we compare 2 points to our line ab to check whether is it towards the third point or away from it
    as the third point is what we compare our point to. The dot product isnt really used for anything except for checking the direction of the vectors 
    that we get from the cross products, as a negative dot product implies different directions
    this lets us check whether 2 points are on the same side of the half plane defined by the line and one of our points (all 4 points must be copanar as well)
    */

    static isOnSameSide(p1, p2, a, b) {

        if (Point.areAligned([p1, p2, a, b])) return false;

        let AB = Vector.fromPoints(a, b);
        let Ap1 = Vector.fromPoints(a, p1);
        let Ap2 = Vector.fromPoints(a, p2);

        if (!Vector.isCoplanar(AB, Ap1, Ap2)) return false;

        let cross1 = AB.cross(Ap1);
        let cross2 = AB.cross(Ap2);

        return cross1.dot(cross2) >= 0;
    }

    static fromPoints(p1, p2) {
        return new Line(p1, Vector.fromPoints(p1, p2));
    }



}

export default Line;