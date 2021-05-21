import { Vector } from "../Vector";

export function getUniqueVectors(vectors: Vector[]) {
    const r = new Array<Vector>();

    o: for (var i = 0, n = vectors.length; i < n; i++) {
        for (var x = 0, y = r.length; x < y; x++) {
            if (r[x].equals(vectors[i])) {
                // yikes ... jumps, https://stackoverflow.com/a/840812
                continue o;
            }
        }
        r[r.length] = vectors[i];
    }
    return r;
}
