const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');

const sum = data.split('\r\n').reduce((acc, line) => {
    const min = {
        red: 0,
        green: 0,
        blue: 0,
    };
    const games = line.split(': ').at(-1).split('; ');
    games.forEach(game => game.split(', ').forEach(cube => {
        const [num, color] = cube.split(' ');
        min[color] = Math.max(min[color], +num);
    }))
    const power = min.red * min.blue * min.green;
    return acc + power;
}, 0);
console.log(sum);