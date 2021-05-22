import fs from "fs";

export function clearLogs() {
    fs.writeFileSync("./log.txt", "");
}

export function log(s: any) {
    if (s.toString) fs.appendFileSync("./log.txt", s.toString() + "\n");
    else fs.appendFileSync("./log.txt", s + "\n");
}
