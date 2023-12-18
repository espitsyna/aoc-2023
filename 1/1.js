const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const sum = data.split('\n').reduce((acc, line) => {
    const numbers = line.split('').filter(c => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(c));
    return acc + (+numbers[0] * 10) + +numbers[numbers.length - 1];
}, 0);
console.log(sum);