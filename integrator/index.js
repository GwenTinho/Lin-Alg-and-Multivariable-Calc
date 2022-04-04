// include a exclude b

function approxIntegral(a,b, f){
    let estimate = 0;
    const n = 1e6;

    for (let i = 0; i < n; i++) {
        estimate += f(Math.random() * (b-a) + a);
    }

    return (b-a) * estimate / n;
}
