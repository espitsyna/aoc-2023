const fs = require('node:fs');

const LIMIT = 64;

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n").map(line => line.split(''));

const startI = data.findIndex(line => line.includes('S'));
const startJ = data[startI].findIndex(c => c === 'S');

const options = [...Array(LIMIT)].reduce(acc => {
    const dst = new Set();
    acc.forEach(src => {
        const [i, j] = src.split(' ').map(n => +n);
        [[i-1, j], [i+1, j], [i, j-1], [i, j+1]].forEach(([a, b]) => {
            if (['.', 'S'].includes((data[a] ?? [])[b])) {
                dst.add(`${a} ${b}`);
            }
        });
    });
    return dst;
}, new Set([`${startI} ${startJ}`]));

console.log(options.size);