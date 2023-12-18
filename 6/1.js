const fs = require('node:fs');

const trim = line => {
    const num = [];
    let i = 0;
    while (i < line.length) {
        let n = '';
        while (line[i] && ' ' !== line[i]) {
            n += line[i];
            i++;
        }
        if (n !== '') {
            num.push(+n);
        }
        i++;
    }

    return num;
};

const [times, distances] = fs.readFileSync('data.txt', 'utf8').split("\r\n").map(line => line.split(':').at(-1)).map(trim);

const m = times.reduce((acc, time, index) => acc * [...Array(time)].filter((_, ms) => (time - ms) * ms > distances[index]).length, 1);
console.log(m);