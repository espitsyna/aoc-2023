const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n").map(row => row.split(''));
const sum = [...Array(data[0].length)].reduce((acc, _, j) => {
    const column = data.map(line => line[j]);
    return  acc + column.reduce((acc, c, index) => {
        if (c !== 'O') {
            return acc;
        }
        const stone = column.slice(0, index).lastIndexOf('#');
        const border = stone === -1 ? 0 : stone + 1;
        const finish = border + column.slice(border, index).filter(c => c === 'O').length;
        const weight = column.length - finish;
        return acc + weight;
    }, 0);
}, 0);

console.log(sum);