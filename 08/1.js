const fs = require('node:fs');

const [directionLine, , ...data] = fs.readFileSync('data.txt', 'utf8').split("\r\n");
const map = {};

const direction = directionLine.split('');
data.forEach(line => {
    const [start, end] = line.split(' = ');
    const [left, right] = end.slice(1, -1).split(', ');
    map[start] = {
        'L': left,
        'R': right,
    };
});


let step = 0;
let point = 'AAA';

while (point !== 'ZZZ') {
    point = map[point][direction[step % direction.length]];
    step++;
}

console.log(step);