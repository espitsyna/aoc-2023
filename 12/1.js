const fs = require('node:fs');

const check = (line, count) => {
    let i = 0;
    let j = 0;
    while (i < line.length) {
        let k = 0;
        while (line[i] === '#') {
            k++;
            i++;
        }

        if (line[i] === '?') {
            return true;
        }

        if (k > 0) {
            if (count[j] !== k || j > count.length) {
                return false;
            }
            j++;
        }
        i++;
    }

    return j === count.length;
};

const go = (line, count, i = 0) => {
    if (i === line.length) {
        return check(line, count) ? 1 : 0;
    }

    if (line[i] !== '?') {
        return go(line, count, i+1);
    }

    const line2 = `${line.substring(0, i)}#${line.substring(i+1)}`;
    const line1 = `${line.substring(0, i)}.${line.substring(i+1)}`;

    return check(line1, count) * go(line1, count, i+1) + check(line2, count) * go(line2, count, i+1);
};

const data = fs.readFileSync('data.txt', 'utf8');
const sum = data.split("\r\n").reduce((acc, line) => {
    const [map, c] = line.split(' ');
    const count = c.split(',').map(n => +n);
    return acc + go(map, count);
}, 0);

console.log(sum);