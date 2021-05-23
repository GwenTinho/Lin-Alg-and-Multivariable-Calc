function print(anything: any) {
    if (anything.toString) console.log(anything.toString() + "\n");
    else console.log(anything + "\n");
}

export default print;
