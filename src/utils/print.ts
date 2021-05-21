function print(anything: any) {
    if (anything.toString) console.log(anything.toString());
    else console.log(anything);
}

export default print;
