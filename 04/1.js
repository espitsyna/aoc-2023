const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');

const trim = line => {
    const num = [];
    let i = 0;
    while (i < line.length) {
        let n = '';
        while (line[i] && ' ' !== line[i]) {
            n += line[i];
            i++;
        }
        if (n !== '') {
            num.push(+n);
        }
        i++;
    }

    return num;
};

const sum = data.split('\r\n').reduce((acc, line) => {
    const numbers = line.split(': ').at(-1);
    const [a, b] = numbers.split('|').map(trim);
    const success = b.filter(n => a.includes(n)).length;
    return acc + (success ? Math.pow(2, success - 1) : 0);
}, 0);
console.log(sum);