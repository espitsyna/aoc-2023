const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n");
const patterns = [];

let pattern = [];
data.forEach(line => {
    if (line === '') {
        patterns.push(pattern);
        pattern = [];
        return;
    }
    pattern.push(line);
});
patterns.push(pattern);

const getColumn = (pattern, j) => pattern.map(row => row[j]);

const sum = patterns.reduce((acc, pattern) => {
    const vertical = [...Array(pattern[0].length - 1)]
        .map((_, j) => j)
        .find(j => {
            let m = j;
            let n = j+1;
            while (JSON.stringify(getColumn(pattern, m)) === JSON.stringify(getColumn(pattern, n))) {
                m--;
                n++;
            }
            return m === -1 || n === pattern[0].length;
        });
    if (vertical !== undefined) {
        return acc + vertical + 1;
    }

    const horizontal = [...Array(pattern.length - 1)]
        .map((_, i) => i)
        .find(i => {
            let m = i;
            let n = i+1;
            while (JSON.stringify(pattern[m]) === JSON.stringify(pattern[n])) {
                m--;
                n++;
            }
            return m === -1 || n === pattern.length;
        });
    if (horizontal !== undefined) {
        return acc + (horizontal + 1) * 100;
    }
}, 0);

console.log(sum);

