const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');

const limit = {
    red: 12,
    green: 13,
    blue: 14,
};

const sum = data.split('\r\n').reduce((acc, line, index) => {
    const games = line.split(': ').at(-1).split('; ');
    const success = games.every(game => game.split(', ').every(cube => {
        const [num, color] = cube.split(' ');
        return +num <= limit[color];
    }));
    return success ? acc + index + 1 : acc;
}, 0);
console.log(sum);