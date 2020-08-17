import Vector from "./Vector";

class Point {
    constructor(coordinates) {
        this.coordinates = coordinates;
    }

    getDimension() {
        return this.coordinates.length;
    }

    static areAligned(points) {
        const initPoint = points[0];

        for (let i = 1; i < points.length - 1; i++) {
            const vPrevious = Vector.fromPoints(initPoint, points[i]);
            const vNext = Vector.fromPoints(initPoint, points[i + 1]);
            if (!Vector.checkAligned(vPrevious, vNext)) return false;
        }

        return true;
    }
}

export default Point;