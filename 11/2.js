const fs = require('node:fs');

const ex = 1000000;

const data = fs.readFileSync('data.txt', 'utf8');
const schema = data.split("\r\n").map(line => line.split(''));

const emptyLines = schema.map((line, index) => line.every(s => s === '.') ? index : null).filter(i => i !== null);
const emptyRows = [...Array(schema[0].length)].map((_, j) => j).filter(j => schema.every(line => line[j] === '.'));

const galaxies = [];
schema.forEach((line, i) => line.forEach((s, j) => {
    if (s !== '.') {
        galaxies.push([i, j]);
    }
}));

const distance = ([i, j], [m, n]) =>
    Math.abs(m - i) + (ex - 1) * emptyLines.filter(index => index > Math.min(i, m) && index < Math.max(i, m)).length +
    Math.abs(n - j) + (ex - 1) * emptyRows.filter(index => index > Math.min(j, n) && index < Math.max(j, n)).length;

const sum = galaxies.reduce((acc, src, index) =>
        acc + galaxies.slice(index + 1).reduce((acc, dst) => acc + distance(src, dst), 0),
    0);

console.log(sum);