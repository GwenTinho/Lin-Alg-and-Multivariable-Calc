class Optimizer {
    constructor(mFunc, constraints, maximizing) { // maximizing : boolean, constraints: booleanvalued function array (of input vector v), mFunc is a multivariable function 
        this.maximizing = maximizing;
        this.mFunc = mFunc;
        this.constraints = constraints;
    }

    optimize() {

    }
}

export default Optimizer;