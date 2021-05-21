import { Matrix } from "./Matrix";
import print from "./utils/print";
import { Vector } from "./Vector";

try {
    const A = Matrix.fromStrings([
        "2 9 0",
        "1 3 5",
        "2 4 7"
    ]);

    print(A.getInverse());
    print(A.getInverse().mul(A)); // doesnt work yet
} catch (error) {
    console.log("\n\n" + error.stack + "\n\n");
}



/*
note to self:
test eigenvalue alg to avoid weird edge cases doesnt work anyways
// more testing pls
also do testing for new triangularity checks
*/
