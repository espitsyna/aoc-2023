const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const schema = data.split("\r\n").map(line => line.split(''));

const emptyLine = [...Array(schema[0].length)].map(() => '.');

const emptyLines = schema.map((line, index) => line.every(s => s === '.') ? index : null).filter(i => i !== null);
const emptyRows = [...Array(schema[0].length)].map((_, j) => j).filter(j => schema.every(line => line[j] === '.'));

const map = [
    ...emptyLines.reduce((acc, index, i) => {
        return [...acc, ...schema.slice(i === 0 ? 0 : emptyLines[i - 1], index), emptyLine]
    }, []),
    ...schema.slice(emptyLines.at(-1)),
].map(line => [
    ...emptyRows.reduce((acc, index, i) => {
        return [...acc, ...line.slice(i === 0 ? 0 : emptyRows[i - 1], index), '.']
    }, []),
    ...line.slice(emptyRows.at(-1)),
]);

const galaxies = [];
map.forEach((line, i) => line.forEach((s, j) => {
    if (s !== '.') {
        galaxies.push([i, j]);
    }
}));

const sum = galaxies.reduce((acc, [i, j], index) =>
        acc + galaxies.slice(index + 1).reduce((acc, [m, n]) => acc + Math.abs(m - i) + Math.abs(n - j), 0),
    0);

console.log(sum);