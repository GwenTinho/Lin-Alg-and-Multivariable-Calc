import { BigFloat } from "./BigFloat";
import { Complex } from "./Complex";
import { Matrix } from "./Matrix";
import { clearLogs } from "./utils/logger";
import print from "./utils/print";
import { Vector } from "./Vector";

BigFloat.flipPrintType();

try {
    //clearLogs(); // up next, testing yey + ortho diag

    const A = Matrix.fromStrings([
        "8 6",
        "-3 2"
    ]);

    debugger

    A.getEigenSpaceBases().forEach(el => {
        print(el.eigenValue);
        print(el.eigenSpaceBasis);
    });

} catch (error) {
    console.log("\n\n" + error.stack + "\n\n");
}
