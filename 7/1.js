const fs = require('node:fs');

const hands = fs.readFileSync('data.txt', 'utf8').split("\r\n").map(line => line.split(' '));

const getType = hand => {
    const dictionary = {};
    hand.split('').forEach(card => {
        dictionary[card] = dictionary[card] ? dictionary[card] + 1 : 1;
    });
    const stat = Object.values(dictionary);

    if (stat.includes(5)) {
        return 7;
    }
    if (stat.includes(4)) {
        return 6;
    }
    if (stat.includes(3) && stat.includes(2)) {
        return 5;
    }
    if (stat.includes(3)) {
        return 4;
    }
    if (stat.filter(n => n === 2).length === 2) {
        return 3;
    }
    if (stat.includes(2)) {
        return 2;
    }
    return 1;
};

const value = {
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
};

hands.sort(([a], [b]) => {
    const typeA = getType(a);
    const typeB = getType(b);

    if (typeA < typeB) {
        return -1;
    }
    if (typeA > typeB) {
        return 1;
    }

    const i = a.split('').findIndex((c, i) => c !== b[i]);
    if (i === -1) {
        return 0;
    }

    const cardA = value[a[i]] ?? +a[i];
    const cardB = value[b[i]] ?? +b[i];

    return cardA < cardB ? -1 : 1;
});

const sum = hands.reduce((acc, [, bid], index) => acc + (index + 1) * (+bid), 0);
console.log(sum);
