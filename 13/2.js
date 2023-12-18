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
const hasSmudge = (line1, line2) => !!line1 && !!line2 && [...line1].filter((c, i) => c !== line2[i]).length === 1;

const sum = patterns.reduce((acc, pattern) => {
    const vertical = [...Array(pattern[0].length - 1)]
        .map((_, j) => j)
        .find(j => {
            let fixed = false;
            let m = j;
            let n = j+1;
            while ((JSON.stringify(getColumn(pattern, m)) === JSON.stringify(getColumn(pattern, n))) || (!fixed && hasSmudge(getColumn(pattern, m), getColumn(pattern, n)))) {
                fixed = fixed || hasSmudge(getColumn(pattern, m), getColumn(pattern, n));
                m--;
                n++;
            }
            return (m === -1 || n === pattern[0].length) && fixed;
        });
    if (vertical !== undefined) {
        return acc + vertical + 1;
    }

    const horizontal = [...Array(pattern.length - 1)]
        .map((_, i) => i)
        .find(i => {
            let fixed = false;
            let m = i;
            let n = i+1;
            while ((JSON.stringify(pattern[m]) === JSON.stringify(pattern[n])) || (!fixed && hasSmudge(pattern[m], pattern[n]))) {
                fixed = fixed || hasSmudge(pattern[m], pattern[n]);
                m--;
                n++;
            }
            return (m === -1 || n === pattern.length) && fixed;
        });
    if (horizontal !== undefined) {
        return acc + (horizontal + 1) * 100;
    }
}, 0);

console.log(sum);

