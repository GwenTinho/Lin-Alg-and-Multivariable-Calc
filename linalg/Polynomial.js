import Vector from "./Vector";

class Polynomial {
    /**
     *
     * @param {Vector} vector contains factors of polynomial from most significant to least
     */
    constructor(vector){
        this.vector = vector;
    }

    eval(x){
        const n = this.vector.getDimension();
        let res = 0;
        for (let i = 0; i < n; i++) {
            const coef = this.vector.get(i);
            res += coef * x ** (n-i);
        }
        return res;
    }
}

export default Polynomial;
