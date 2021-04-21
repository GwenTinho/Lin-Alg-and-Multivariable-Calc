import Matrix from "./Matrix";
import Vector from "./Vector";

function gramSchmidt(vectors) {
  let out = [];

  for (let i = 0; i < vectors.length; i++) {
    let nextV = vectors[i].copyInstance();

    for (let j = 0; j < out.length; j++) {
      nextV = nextV.sub(vectors[i].projectOnto(out[j]));
    }
    out.push(nextV);
  }

  return out.filter(v => !v.isZero());
}

function gramSchmidtNorm(vectors) {
  return gramSchmidt(vectors).map(v => v.asUnit());
}

/**
 *
 * @param {Matrix} matrix
 */
function findQR(matrix) {
  let Q = new Matrix(gramSchmidtNorm(matrix.vectors));

  if (Q.getDimensions()[1] !== matrix.getDimensions()[1]) throw new Error("Cant QR-decompose if initial matrix is not LI");

  let Rvectors = [];
  const len = matrix.vectors.length;

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

function isOrthogonalSet(vectors) {
  const len = vectors.length

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i !== j) {
        if (!vectors[i].isOrthogonal(vectors[j])) return false;
      }
    }
  }
  return true;
}

function isOrthonormalSet(vectors) {
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


export default {
  gramSchmidt,
  gramSchmidtNorm,
  findQR,
  isOrthogonalSet,
  isOrthonormalSet
}
