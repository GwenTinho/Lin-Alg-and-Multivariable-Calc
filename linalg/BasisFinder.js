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

export default {
  findColSpaceBasis,
  findRowSpaceBasis
}
