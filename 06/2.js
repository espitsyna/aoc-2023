const fs = require('node:fs');


const [time, distance] = fs.readFileSync('data.txt', 'utf8')
    .split("\r\n")
    .map(line => line.split(':').at(-1).split(' ').filter(c => c !== ' ').join(''))
    .map(n => +n);

const t = [...Array(time)].filter((_, ms) => (time - ms) * ms > distance).length;
console.log(t);

