function newtonsMethod(fn, initial, error, maxIterations) {
    let pivot = initial;
    let h = error;
    let fnPivot = fn(pivot);
    let fnPivotSq = fnPivot * fnPivot;

    for (let index = 0; fnPivotSq > error && index < maxIterations; index++) {
        pivot = pivot - h * fnPivot / (fn(pivot + h) - fnPivot);
        fnPivot = fn(pivot);
        fnPivotSq = fnPivot * fnPivot;
    }

    if (pivot === Infinity) return newtonsMethod(fn, initial + 1.1, error, maxIterations);

    return pivot;
}

export default newtonsMethod;