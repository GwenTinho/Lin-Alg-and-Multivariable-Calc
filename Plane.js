import Vector from "./Vector";
import Point from "./Point";
import Matrix from "./Matrix";
import Line from "./Line";

class Plane {
    constructor(v1, v2, point) {
        this.vector1 = v1;
        this.vector2 = v2;
        this.point = point;

        this.isValidPlane = this.vector1.isAligned(this.vector2); // checks if the vectors of the plane are aligned
    }

    isPointInPlane(point) {
        if (!this.isValidPlane) return false;

        let m1 = new Matrix([Vector.fromPoints(this.point, point), this.vector1, this.vector2]);

        return m1.det() === 0;
    }

    isCoplanar(vector) {
        if (!this.isValidPlane) return false;

        let m1 = new Matrix([vector, this.vector1, this.vector2]);

        return m1.det() === 0;
    }

    findLinePlaneIntersect(line) {
        if (!this.isValidPlane) return Point([NaN]); // obviously the error behaviour can be tweaked, this was just the most useful to my applications

        const deltaY = -Matrix.fastDet2d(
            [this.vector1.coordinates[0], this.vector1.coordinates[2]],
            [this.vector2.coordinates[0], this.vector2.coordinates[2]]
        );

        const deltaX = Matrix.fastDet2d(
            [this.vector1.coordinates[1], this.vector1.coordinates[2]],
            [this.vector2.coordinates[1], this.vector2.coordinates[2]]
        );

        const deltaZ = Matrix.fastDet2d(
            [this.vector1.coordinates[0], this.vector1.coordinates[1]],
            [this.vector2.coordinates[0], this.vector2.coordinates[1]]
        );

        const tNomX = deltaX * (this.point.coordinates[0] - line.point.coordinates[0]);
        const tNomY = deltaY * (this.point.coordinates[1] - line.point.coordinates[1]);
        const tNomZ = deltaZ * (this.point.coordinates[2] - line.point.coordinates[2]);

        const tNom = tNomX + tNomY + tNomZ;

        const tDenomX = deltaX * line.vector.coordinates[0];
        const tDenomY = deltaY * line.vector.coordinates[1];
        const tDenomZ = deltaZ * line.vector.coordinates[2];

        const tDenom = tDenomX + tDenomY + tDenomZ;

        const t = tNom / tDenom;

        return line.getPointAtT(t);
    }

    static fromPoints(p1, p2, p3) {
        return new Plane(Vector.fromPoints(p1, p2), Vector.fromPoints(p1, p3), p1);
    }
}

export default Plane;