const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split(",");
const sum = data.reduce((acc, line) => acc + line.split('').reduce((acc, c) => {
    const code = c.charCodeAt(0);
    return ((acc + code) * 17) % 256;
}, 0), 0);

console.log(sum);