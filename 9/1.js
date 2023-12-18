const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n");

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

const sum = data.map(trim).reduce((acc, line) => {
    const numbers = [];
    numbers.push(line);
    while (!numbers.at(-1).every(n => n === 0)) {
        const last = numbers.at(-1);
        numbers.push([...Array(last.length - 1)].map((_, i) => last[i + 1] - last[i]));
    }
    return acc + numbers.reduce((acc, n) => acc + n.at(-1), 0);
}, 0);

console.log(sum);