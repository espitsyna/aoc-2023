const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const schema = data.split("\r\n").map(line => line.split(''));

const int = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const isSymbol = a => !int.includes(a) && a !== '.' && a !== undefined;

const check = (i, j) =>
    isSymbol((schema[i-1] || [])[j-1]) || isSymbol((schema[i-1] || [])[j]) || isSymbol((schema[i-1] || [])[j+1]) ||
    isSymbol(schema[i][j-1]) || isSymbol(schema[i][j+1]) ||
    isSymbol((schema[i+1] || [])[j-1]) || isSymbol((schema[i+1] || [])[j]) || isSymbol((schema[i+1] || [])[j+1]);

const sum = schema.reduce((acc, line, index) => {
    let result = 0;
    let i = 0;
    while (i < line.length) {
        let n = '';
        let isAdjacent = false;

        while (int.includes(line[i])) {
            n += line[i];
            if (!isAdjacent) {
                isAdjacent = check(index, i);
            }
            i++;
        }
        if (isAdjacent) {
            result += +n;
        }
        i++;
    }

    return acc + result;
}, 0);
console.log(sum);
