function newtonsMethod(fn, error = 1e-5, maxIterations = 20) {
    debugger
    let pivot = bisectionMethod(fn);
    let h = error;
    let fnPivot = fn(pivot);
    let fnPivotSq = fnPivot * fnPivot;

    if (isNaN(fnPivot) || !isFinite(fnPivot)) return newtonsMethod(fn, initial + Math.random() * 2, error, maxIterations);

    for (let index = 0; fnPivotSq > error ** 2 && index < maxIterations; index++) {
        if (index == Math.floor(maxIterations / 3)) h = h * 1e-1; // to make it converge faster
        if (index == Math.floor(maxIterations / 2)) h = h * 1e-1; // to make it converge faster
        pivot = pivot - h * (fnPivot / (fn(pivot + h) - fnPivot));
        fnPivot = fn(pivot);
        fnPivotSq = fnPivot * fnPivot;
    }

    if (isNaN(pivot) || !isFinite(pivot)) return newtonsMethod(fn, initial + Math.random() * 2, error, maxIterations);

    return pivot;
}

function bisectionMethod(f, error = 0.5, maxIterations = 30) {
    let a = -20;
    let b = 20;
    let c = (a + b) / 2;

    for (let index = 0; index < maxIterations && f(c) ** 2 > error ** 2 && (b - a) / 2 > error; index++) {
        if (Math.sign(f(c)) === Math.sign(f(a))) a = c;
        else b = c;

        c = (a + b) / 2;
    }
    console.log(c)
    return c;
}


export default newtonsMethod;