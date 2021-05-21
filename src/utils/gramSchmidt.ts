import { Matrix } from "../Matrix";
import { Vector } from "../Vector";

export function gramSchmidt(vectors: Vector[]) {
    let out = [];

    for (let i = 0; i < vectors.length; i++) {
        let nextV = vectors[i].cpy();

        for (let j = 0; j < out.length; j++) {
            nextV = nextV.sub(vectors[i].projectOnto(out[j]));
        }
        out.push(nextV);
    }

    return out.filter(v => !v.isZero());
}

export function gramSchmidtNorm(vectors: Vector[]) {
    return gramSchmidt(vectors).map(v => v.asUnit());
}

export function findQR(matrix: Matrix) {
    let Q = new Matrix(gramSchmidtNorm(matrix.getVectors()));

    if (Q.dimensions()[1] !== matrix.dimensions()[1]) throw new Error("Cant QR-decompose if initial matrix is not LI");

    let Rvectors = [];
    const len = matrix.dimensions()[1];

    for (let i = 0; i < len; i++) {
        let v = [];

        for (let j = 0; j < len; j++) {
            v.push(matrix.getCol(i).dot(Q.getCol(j)));
        }
        Rvectors.push(new Vector(v));
    }

    let R = new Matrix(Rvectors);

    return { Q, R };
}

export function isOrthogonalSet(vectors: Vector[]) {
    const len = vectors.length;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (i !== j) {
                if (!vectors[i].isOrthogonal(vectors[j])) return false;
            }
        }
    }
    return true;
}

export function isOrthonormalSet(vectors: Vector[]) {
    const len = vectors.length

    for (let i = 0; i < len; i++) {
        if (!vectors[i].isUnit()) return false;

        for (let j = 0; j < len; j++) {
            if (i !== j) {
                if (!vectors[i].isOrthogonal(vectors[j])) return false;
            }
        }
    }
    return true;
}
