const fs = require('node:fs');

const RIGHT = 1;
const LEFT = -1;
const UP = 2;
const DOWN = -2;

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n").map(row => row.split(''));
const numRows = data.length;
const numColumns = data[0].length;

const move = ([i, j], direction) => {
    let moveI = i;
    if (direction === DOWN) {
        moveI++;
    } else if (direction === UP) {
        moveI --;
    }
    let moveJ = j;
    if (direction === RIGHT) {
        moveJ++;
    } else if (direction === LEFT) {
        moveJ --;
    }

    return [moveI, moveJ];
};

const reflect = direction => {
    switch (direction) {
        case RIGHT:
            return UP;
        case LEFT:
            return DOWN;
        case UP:
            return RIGHT;
        case DOWN:
            return LEFT;
    }
};

const exit = ([i, j], direction, map) => i < 0 || i >= numRows || j < 0 || j >= numColumns || map[i][j].includes(direction);

const go = ([i, j], direction, map) => {
    if (exit([i, j], direction, map)) {
        return [map];
    }

    map[i][j].push(direction);
    switch (data[i][j]) {
        case '.':
            return go(move([i, j], direction), direction, map);
        case '/':
            const targetDirection1 = reflect(direction);
            return go(move([i, j], targetDirection1), targetDirection1, map);
        case '\\':
            const targetDirection2 = -reflect(direction);
            return go(move([i, j], targetDirection2), targetDirection2, map);
        case '|':
            if (direction === UP || direction === DOWN) {
                return go(move([i, j], direction), direction, map);
            }
            const t1 = move([i, j], UP);
            const t2 = move([i, j], DOWN);
            return [map, ...go(t1, UP, map), ...go(t2, DOWN, map)];
        case '-':
            if (direction === LEFT || direction === RIGHT) {
                return go(move([i, j], direction), direction, map);
            }
            const t3 = move([i, j], RIGHT);
            const t4 = move([i, j], LEFT);
            return [map, ...go(t3, RIGHT, map), ...go(t4, LEFT, map)];
        default:
            return [map];

    }
}

const sum = result => data.reduce((acc, line, i) => acc + line.reduce((acc, _, j) => acc + (result.some(r => r[i][j].length) ? 1 : 0), 0), 0);
const test = (point, direction) => {
    const newMap = [...data.map(line => line.map(_ => []))];
    return sum(go(point, direction, newMap));
}

const max = Math.max(...[
    ...[...Array(numRows)].map((_, i) => test([i, 0], RIGHT)),
    ...[...Array(numRows)].map((_, i) => test([i, numColumns - 1], LEFT)),
    ...[...Array(numColumns)].map((_, j) => test([0, j], DOWN)),
    ...[...Array(numColumns)].map((_, j) => test([numRows - 1, j], UP)),
]);

console.log(max);