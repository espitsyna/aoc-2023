const fs = require('node:fs');

const LOW = 200000000000000;
const HIGH = 400000000000000;

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n").map(line => {
    const [position, velocity] = line.split(' @ ');
    return {
        position: position.split(', ').map(i => +i),
        velocity: velocity.split(', ').map(i => +i),
    };
});

const sum = data.reduce((acc, s1, index) => acc + data.slice(index + 1).reduce((acc, s2) => {
    const { position: [A, B], velocity: [a, b] } = s1;
    const { position: [C, D], velocity: [c, d] } = s2;
    const x = (D - C * d/c + A * b/a - B) / (b/a - d/c);
    if (x < LOW || x > HIGH || (x - A) * a < 0 || (x - C) * c < 0) {
        return acc;
    }

    const y = b/a * x + B - A * b/a;
    if (y < LOW || y > HIGH || (y - B) * b < 0 || (y - D) * d < 0) {
        return acc;
    }

    return acc + 1;
}, 0), 0);


console.log(sum);
