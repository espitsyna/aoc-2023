const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8')
    .split("\r\n")
    .reduce((acc, line, index) => ({
        ...acc,
        [index]: {
            key: `${index}`,
            height: 0,
            coords: line.split('~').map(coords => coords.split(',').map(n => +n)),
            supportedBy: [],
        },
    }), {});

const bricks = Object.values(data);

bricks.sort(({ coords: a }, {coords: b }) => {
    if (a[0][2] < b[0][2]) {
        return -1;
    }
    if (a[0][2] > b[0][2]) {
        return 1;
    }
    return 0;
});

bricks.forEach(({ coords: [a, b], key }, index) => {
    const below = bricks
        .slice(0, index)
        .filter(({ coords: [c, d] }) => a[0] <= d[0] && b[0] >= c[0] && a[1] <= d[1] && b[1] >= c[1]);
    if (below.length) {
        const maxHeight = Math.max(...below.map(({ key }) => data[key].height));
        const supportedBy = below.filter(({ key }) => data[key].height === maxHeight);
        data[key].height = maxHeight + b[2] - a[2] + 1;
        data[key].supportedBy = supportedBy.map(({ key }) => key);
    } else {
        data[key].height = 1 + b[2] - a[2];
    }
});

const amount = Object.keys(data).filter(key => Object.values(data).every(({ supportedBy }) => JSON.stringify(supportedBy) !== JSON.stringify([key]))).length;
console.log(amount);