export function gcd(a: bigint, b: bigint) {
    let t: bigint;

    while (b !== 0n) {
        t = b;
        b = a % b;
        a = t;
    }
    return a;
}

export function sign(a: bigint) {
    if (a === 0n) return 0n;
    if (a > 0n) return 1n;
    return -1n;
}

export function abs(a: bigint) {
    return a < 0n ? a * -1n : a;
}

// Transform a ‘+’ or ‘-‘ character to +1 or -1
export function pm(c: string) {
    return parseFloat(c + "1");
}

// Create a new bigint of 10^n. This turns out to be a bit
// faster than multiplying.
export function exp10(n: number) {
    return BigInt(`1${[...new Array(n)].map(() => 0).join("")}`);
}
