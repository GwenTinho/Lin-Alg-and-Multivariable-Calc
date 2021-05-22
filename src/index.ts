import { BigFloat } from "./BigFloat";
import { Complex } from "./Complex";
import { Matrix } from "./Matrix";
import { clearLogs } from "./utils/logger";
import print from "./utils/print";
import { Vector } from "./Vector";

try {
    clearLogs();

    const A = Matrix.fromStrings([
        "2 9 0",
        "1 3 5",
        "2 4 7"
    ]);

    print(A.getInverse());
    print(A.getInverse().mul(A));
} catch (error) {
    console.log("\n\n" + error.stack + "\n\n");
}
