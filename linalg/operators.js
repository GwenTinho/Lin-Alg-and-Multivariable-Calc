import Matrix from "./Matrix";
import Vector from "./Vector";

function reflectX(v) {
  return (new Matrix([
    new Vector([1, 0]),
    new Vector([0, -1])
  ])).multByVector(v);
}

function reflectY(v) {
  return (new Matrix([
    new Vector([-1, 0]),
    new Vector([0, 1])
  ])).multByVector(v);
}

function reflectBisector(v) {
  return (new Matrix([
    new Vector([0, 1]),
    new Vector([1, 0])
  ])).multByVector(v);
}

function reflectXY(v) {
  return (new Matrix([
    new Vector([1, 0, 0]),
    new Vector([0, 1, 0]),
    new Vector([0, 0, -1])
  ])).multByVector(v);
}

function reflectXZ(v) {
  return (new Matrix([
    new Vector([1, 0, 0]),
    new Vector([0, -1, 0]),
    new Vector([0, 0, 1])
  ])).multByVector(v);
}

function reflectYZ(v) {
  return (new Matrix([
    new Vector([-1, 0, 0]),
    new Vector([0, 1, 0]),
    new Vector([0, 0, 1])
  ])).multByVector(v);
}

function projectX(v) {
  return (new Matrix([
    new Vector([1, 0]),
    new Vector([0, 0])
  ])).multByVector(v);
}

function projectY(v) {
  return (new Matrix([
    new Vector([0, 0]),
    new Vector([0, 1])
  ])).multByVector(v);
}

function rotateCCL2D(v, angle) {
  const cosVal = Math.cos(angle);
  const sinVal = Math.sin(angle);

  return (new Matrix([
    new Vector([cosVal, -sinVal]),
    new Vector([sinVal, cosVal])
  ])).multByVector(v);
}

/**
 *
 * @param {Vector} v
 * @param {Number} angle
 * @param {Vector} axisVector gets normalized, discribes the axis of rotation
 */
function rotateCCLAroundAxis3D(v, angle, axisVector) {
  const normalAxis = axisVector.asUnit();
  const a = normalAxis.get(0);
  const b = normalAxis.get(1);
  const c = normalAxis.get(2);

  const cosVal = Math.cos(angle);
  const sinVal = Math.sin(angle);

  const oneMinusCos = 1 - cosVal;

  const col1 = new Vector([
    a * a * oneMinusCos + cosVal,
    a * b * oneMinusCos + c * sinVal,
    a * c * oneMinusCos - b * sinVal
  ]);

  const col2 = new Vector([
    b * a * oneMinusCos - c * sinVal,
    b * b * oneMinusCos + cosVal,
    b * c * oneMinusCos + b * sinVal
  ]);

  const col3 = new Vector([
    c * a * oneMinusCos + b * sinVal,
    c * b * oneMinusCos - a * sinVal,
    c * c * oneMinusCos + cosVal
  ]);

  return (new Matrix([
    col1,
    col2,
    col3
  ])).multByVector(v);
}

function dilateVector(v, k) {
  if (k > 1) return v.mult(k);
}

function contractVector(v, k) {
  if (k >= 0 || k < 1) return v.mult(k);
}


export default {
  reflectX,
  reflectY,
  reflectXY,
  reflectXZ,
  reflectYZ,
  projectX,
  projectY,
  rotateCCL2D,
  rotateCCLAroundAxis3D,
  contractVector,
  dilateVector
}
