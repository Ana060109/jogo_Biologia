export function embaralhar(array) {
    let curr = array.length;
    let rnd;

    while (curr !== 0) {
        rnd = Math.floor(Math.random() * curr);
        curr -= 1;
        [array[curr], array[rnd]] = [array[rnd], array[curr]];
    }

    return array;
}

export function rolarD20() {
    return Math.floor(Math.random() * 20) + 1;
}
