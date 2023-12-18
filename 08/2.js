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

const points = Object.keys(map).filter(point => point.endsWith('A'));

const times = points.map(start => {
    let step = 0;
    let point = start;
    while (!point.endsWith('Z')) {
        point = map[point][direction[step % direction.length]];
        step++;
    }
    return step;
});

const isPrime = n => n !== 0 && n !== 1 && [...Array(Math.floor(n / 2))].every((_, i) => i === 0 || i === 1 || n % i);

const bound = Math.floor(Math.max(...times) / 2);
const divisors = [...[...Array(bound)].map((_, i) => isPrime(i) && times.some(t => t % i === 0) ? i : null).filter(Boolean), ...times.filter(t => t > bound && isPrime(t))];

const common = divisors.reduce((acc, d) => acc * d, 1);
console.log(common);