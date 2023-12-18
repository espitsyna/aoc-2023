const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const schema = data.split("\r\n").map(line => line.split(''));

const startI = schema.findIndex(m => m.includes('S'));
const startJ = schema[startI].findIndex(s => s === 'S');

let step = 0;
const map = schema.map(line => [...line]);
map[startI][startJ] = step;

let isLoop = false;
while (!isLoop) {
    step++;
    map.forEach((line, i) => line.forEach((s, j) => {
        if (
            map[i][j-1] === step - 1 &&
            (s === '-' || s === 'J' || s === '7') &&
            (schema[i][j-1] === '-' || schema[i][j-1] === 'F' || schema[i][j-1] === 'L' || schema[i][j-1] === 'S')
        ) {
            map[i][j] = step;
        }
        if (
            map[i][j+1] === step - 1 &&
            (s === '-' || s === 'F' || s === 'L') &&
            (schema[i][j+1] === '-' || schema[i][j+1] === 'J' || schema[i][j+1] === '7' || schema[i][j+1] === 'S')
        ) {
            if (map[i][j] === step) {
                isLoop = true;
            }
            map[i][j] = step;
        }
        if (
            (map[i-1] || [])[j] === step - 1 &&
            (s === '|' || s === 'J' || s === 'L') &&
            (schema[i-1][j] === '|' || schema[i-1][j] === 'F' || schema[i-1][j] === '7' || schema[i-1][j] === 'S')
        ) {
            if (map[i][j] === step) {
                isLoop = true;
            }
            map[i][j] = step;
        }
        if (
            (map[i+1] || [])[j] === step - 1 &&
            (s === '|' || s === 'F' || s === '7') &&
            (schema[i+1][j] === '|' || schema[i+1][j] === 'J' || schema[i+1][j] === 'L' || schema[i+1][j] === 'S')
        ) {
            if (map[i][j] === step) {
                isLoop = true;
            }
            map[i][j] = step;
        }
    }));
}

console.log(step);
