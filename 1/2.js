const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');

const dictionary = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9
};

const sum = data.split('\n').reduce((acc, line) => {
    const numbers = line
        .split('')
        .map((_, i) => dictionary[Object.keys(dictionary).find(num => line.substring(i).startsWith(num))])
        .filter(num => num !== undefined);

    return acc + numbers[0] * 10 + numbers[numbers.length - 1];
}, 0);
console.log(sum);