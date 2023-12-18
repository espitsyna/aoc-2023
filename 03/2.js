const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const schema = data.split("\r\n").map(line => line.split(''));

const int = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const numbers = [];
schema.forEach((line, index) => {
    let i = 0;
    while (i < line.length) {
        let n = '';
        const start = i;
        while (int.includes(line[i])) {
            n += line[i];
            i++;
        }
        if (n !== '') {
            numbers.push({
                num: +n,
                line: index,
                start,
                end: i - 1,
            });
        }
        i++;
    }
}, 0);

const getNumbers = (i, j) => numbers.filter(({ line, start, end }) => {
    if (line === i) {
        return j === start - 1 || j === end + 1;
    }
    if (line === i - 1 || line === i + 1) {
        return j <= end + 1 && j >= start - 1;
    }
    return false;
}).map(({ num }) => num);

const sum = schema.reduce((acc, line, index) => {
    let result = 0;
    line.forEach((c, i) => {
        if (c === '*') {
            const n = getNumbers(index, i);
            if (n.length === 2) {
                result += n[0] * n[1];
            }
        }
    });
    return acc + result;
}, 0);
console.log(sum);
