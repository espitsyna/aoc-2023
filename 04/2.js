const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n');

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

const count = {};
data.forEach((_, index) => {
    count[index] = 1;
});

data.forEach((line, index) => {
    const numbers = line.split(': ').at(-1);
    const [a, b] = numbers.split('|').map(trim);
    const success = b.filter(n => a.includes(n)).length;

    [...Array(success)].map((_, i) => {
        count[index + i + 1] += count[index];
    });
});

console.log(Object.values(count).reduce((acc, num) => acc + num, 0));
