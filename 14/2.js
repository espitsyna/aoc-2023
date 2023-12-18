const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n").map(row => row.split(''));
const north = () => [...Array(data[0].length)].forEach((_, j) => {
    const column = data.map(line => line[j]);
    column.forEach((c, index) => {
        if (c !== 'O') {
            return;
        }
        const stone = column.slice(0, index).lastIndexOf('#');
        const border = stone === -1 ? 0 : stone + 1;
        const finish = border + column.slice(border, index).filter(c => c === 'O').length;
        data[index][j] = '.';
        data[finish][j] = 'O';
    });
});

const west = () => data.forEach((row, i) => {
    row.forEach((c, index) => {
        if (c !== 'O') {
            return;
        }
        const stone = row.slice(0, index).lastIndexOf('#');
        const border = stone === -1 ? 0 : stone + 1;
        const finish = border + row.slice(border, index).filter(c => c === 'O').length;

        data[i][index] = '.';
        data[i][finish] = 'O';
    });
});

const south = () => [...Array(data[0].length)].forEach((_, j) => {
    const column = data.map(line => line[j]);
    column.reverse().forEach((c, index) => {
        if (c !== 'O') {
            return;
        }
        const stone = column.slice(0, index).lastIndexOf('#');
        const border = stone === -1 ? 0 : stone + 1;
        const finish = border + column.slice(border, index).filter(c => c === 'O').length;
        data[column.length - index - 1][j] = '.';
        data[column.length - finish - 1][j] = 'O';
    });
});

const east = () => data.forEach((line, i) => {
    const row = [...line].reverse();
    row.forEach((c, index) => {
        if (c !== 'O') {
            return;
        }
        const stone = row.slice(0, index).lastIndexOf('#');
        const border = stone === -1 ? 0 : stone + 1;
        const finish = border + row.slice(border, index).filter(c => c === 'O').length;

        data[i][row.length - index - 1] = '.';
        data[i][row.length - finish - 1] = 'O';
    });
});

const cycle = () => {
    north();
    west();
    south();
    east();
};

const count = data => data.reduce((acc, line, i) => acc + line.reduce((acc, c) => acc + (c === 'O' ? data.length - i : 0), 0), 0);

const history = [];
history.push([...data.map(line => [...line])]);

let i = 1;
let prevIndex = -1;
while (i <= 1000000000) {
    cycle();
    prevIndex = history.findIndex(prev => prev.every((line, i) => JSON.stringify(line) === JSON.stringify(data[i])));
    if (prevIndex !== -1) {
        break;
    }
    history.push([...data.map(line => [...line])]);
    i++;
}

const res = ((1000000000 - prevIndex) % (i - prevIndex)) + prevIndex;
console.log(count(history[res]));


