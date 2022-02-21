function fac(n){
    if(n < 0) throw new Error("factorial of negative number");
    if(n < 2) return 1;
    let acc = 2;

    for (let i = 3; i <= n; i++) {
        acc *= i;
    }

    return acc;
}

export default {
    fac
}
