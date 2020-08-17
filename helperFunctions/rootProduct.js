function rootProduct(x, roots) { // product of (x - x0) (x - x1) ... (x0, x1, ... roots of polynomial)
    let prod = 1;
    for (let index = 0; index < roots.length; index++) {
        prod *= (x - roots[index]);
    }
    return prod;
}

export default rootProduct;