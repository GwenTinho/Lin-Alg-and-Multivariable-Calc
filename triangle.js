import Vector from "./Vector";
import Point from "./Point";
import Matrix from "./Matrix";
import Line from "./Line";
import Plane from "./Plane";

// triangle in 3d

class Triangle extends Plane {
    constructor(A, B, C) { // points A,B,C defining triangle (ABC)
        // we also define all the variables for planar functions
        super(Vector.fromPoints(A, B), Vector.fromPoints(A, C), A);
        this.A = A;
        this.B = B;
        this.C = C;
    }

    isPointInTriangle(point) {

        if (!this.isValidPlane) return false;
        //if (!this.isCoplanar(point)) return false; already check in isOnSameSide

        return Line.isOnSameSide(point, this.A, this.B, this.C) &&
            Line.isOnSameSide(point, this.B, this.A, this.C) &&
            Line.isOnSameSide(point, this.C, this.A, this.B);
    }

    getArea() {
        if (!this.isValidPlane) return NaN;

        return this.vector1.cross(this.vector2).getNorm() / 2;
    }

    isRightInA() {
        if (!this.isValidPlane) return false;

        return this.vector1.dot(this.vector2) == 0;
    }

    getAngles() { // definition from https://en.wikipedia.org/wiki/Triangle using thm d' Al Kashi
        const a = Vector.fromPoints(this.B, this.C).getNorm();
        const b = this.vector2.getNorm();
        const c = this.vector1.getNorm();
        const aSqr = a * a;
        const bSqr = b * b;
        const cSqr = c * c;

        // alpha, beta, gamma are the angles originating from their corresponing point (alpha, A), (beta,B), (gamma,C)

        const alpha = Math.acos((bSqr + cSqr - aSqr) / (2 * b * c));
        const beta = Math.acos((aSqr + cSqr - bSqr) / (2 * a * c));
        const gamma = Math.acos((aSqr + bSqr - cSqr) / (2 * a * b));

        return {
            alpha,
            beta,
            gamma
        }
    }

}

export default Triangle;