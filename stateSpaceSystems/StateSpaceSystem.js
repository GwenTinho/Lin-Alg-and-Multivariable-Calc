import fadeev from "../linalg/fadeev";
import Matrix from "../linalg/Matrix";
import Polynomial from "../linalg/Polynomial";
import Vector from "../linalg/Vector";

class StateSpaceSystem{

    /**
     *
     * @param {Matrix} A
     * @param {Matrix} B
     * @param {Matrix} C
     * @param {Matrix} D
     */
    constructor(A,B,C,D){
        this.A = A;
        this.B = B;
        this.C = C;
        this.D = D;

        // dimensionality checks are missing
    }

    transferFunctionAt(s){
        const {chracteristicPolyterms, auxMatricies} = fadeev.fadeev(this.A);

        const polyAt = (new Polynomial(new Vector(chracteristicPolyterms))).eval(s);

        const n = this.A.getDimensions()[0];

        let inverseTerm = Matrix.getZeroMatrix(n,n);

        for (let i = 0; i < n; i++) {
            inverseTerm = inverseTerm.add(auxMatricies[i].multByReal(s ** (n-i)));
        }
        inverseTerm = inverseTerm.multByReal(1/polyAt);

        return this.C.mul(inverseTerm).mul(this.B).add(this.D);
    }

    impulseResponseAt(t){
        // assume D = 0 otherwise i have no idea how to approx dirac

        return this.C.mul(this.A.multByReal(t).exp()).mul(this.C);
    }
}

export default StateSpaceSystem
