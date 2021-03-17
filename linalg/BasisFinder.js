import Matrix from "./Matrix";

/**
 *
 * @param {Matrix} rref
 */
function findPivotRows(rref) {
  const rowIndicies = [];
  const rows = rref.getDimensions()[0];

  for (let i = 0; i < rows; i++) {
    const rowV = rref.getRow(i);

    if (!rowV.isZero()) rowIndicies.push(i);
  }
  return rowIndicies;
}

/**
 *
 * @param {Matrix} rref
 */
function findPivotColumns(rref) {
  const pivotRowsIndicies = findPivotRows(rref);

  const pivotColIndicies = [];
  const cols = rref.getDimensions()[1];

  for (let i = 0; i < pivotRowsIndicies.length; i++) {
    const currentRow = rref.getRow(pivotRowsIndicies[i]);

    for (let j = 0; j < cols; j++) {
      const entry = currentRow.get(j);

      if (entry === 1) {
        pivotColIndicies.push(j);
        j = cols;
      }
    }
  }

  return pivotColIndicies;
}

/**
 *
 * @param {Matrix} m
 */
function findRowSpaceBasis(m) {
  const rref = m.getRref();
  const pivotRows = findPivotRows(rref);

  const basis = [];

  for (let i = 0; i < pivotRows.length; i++) {
    basis.push(rref.getRow(i));
  }
  return basis;
}

/**
 *
 * @param {Matrix} m
 */
function findColSpaceBasis(m) {
  const rref = m.getRref();

  const pivotCols = findPivotColumns(rref);

  const basis = [];

  for (let i = 0; i < pivotCols.length; i++) {
    basis.push(m.getCol(pivotCols[i]));
  }
  return basis;
}


/**
 *
 * @param {Matrix} m
 */
function findNullSpaceBasis(m) {
  const transpose = m.T();

  const rref = transpose.getRref(); // B

  const reducedMatrix = transpose.getConversionMatrix(); // M

  const basis = [];
  const rows = rref.getDimensions()[0];

  for (let i = 0; i < rows; i++) {
    if (rref.getRow(i).isZero()) {
      basis.push(reducedMatrix.getRow(i));
    }
  }

  return basis;
}

//from the last answer here https://math.stackexchange.com/questions/433932/equivalent-basis-of-a-subspace

function spansSameSpace(basis1, basis2) {
  const U = new Matrix(basis1);
  const V = new Matrix(basis2);

  const rankU = U.getRank();
  const rankV = V.getRank();

  if (rankU !== rankV) return false;

  const R = U.getRref();

  const convMat = U.getConversionMatrix().copyInstance();

  const VBar = convMat.mul(V);
  const rows = R.getDimensions()[0];



  for (let i = 0; i < rows; i++) {
    if (R.getRow(i).isZero()) {
      if (!VBar.getRow(i).isZero()) return false;
    }
  }
  return true;
}

export default {
  findColSpaceBasis,
  findRowSpaceBasis,
  findNullSpaceBasis,
  spansSameSpace
}
