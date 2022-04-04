// include a exclude b

function approxIntegralOneVar(a,b, f){
    let estimate = 0;
    const n = 1e6;

    for (let i = 0; i < n; i++) {
        estimate += f(Math.random() * (b-a) + a);
    }

    return (b-a) * estimate / n;
}

function approxIntegral(ranges, f){
    let estimate = 0;
    const n = 1e6;

    for (let i = 0; i < n; i++) {
        estimate += f(ranges.map(range => Math.random() * (range[1]-range[0]) + range[0]));
    }

    return ranges.reduce((acc, curr) => acc * (curr[1]-curr[0]), 1) * estimate / n;
}
