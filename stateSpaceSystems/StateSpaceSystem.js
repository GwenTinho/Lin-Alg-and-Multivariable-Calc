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

    controllability(){
        const copyB = this.B.copyInstance();

        if(copyB.getDimensions()[1] != 1){
            throw new Error("Bad dimensions or smth");
        }

        const columns = [copyB.getCol(0)];

        for (let i = 0; i < this.A.getDimensions()[0] - 1; i++) {
            columns.push(this.A.multByVector(columns[columns.length - 1]));
        }

        return new Matrix(columns);
    }

    observability(){
        const copyC = this.C.copyInstance();

        if(copyB.getDimensions()[0] != 1){
            throw new Error("Bad dimensions or smth");
        }

        const rows = [copyC.getRow(0)];

        for (let i = 0; i < this.A.getDimensions()[0] - 1; i++) {
            rows.push(this.A.T().multByVector(rows[rows.length-1]));
        }

        return (new Matrix(rows)).T();
    }
}

export default StateSpaceSystem
