const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n");

const seeds = data[0].split(': ').at(-1).split(' ').map(n => +n);

const maps = [];
let i = 2;
while (i < data.length) {
    const line = data[i];
    if (line.includes('map')) {
        const map = [];
        i++;
        while (data[i] && data[i] !== '') {
            map.push(data[i].split(' ').map(n => +n));
            i++;
        }
        maps.push(map);
    }
    i++;
}

const min = Math.min(...seeds.map(seed => maps.reduce((acc, map) => {
    const rule = map.find(([, src, range]) => acc >= src && acc <= src + range);
    if (rule) {
        const [dst, src] = rule;
        return dst + acc - src;
    }
    return acc;
}, seed)));
console.log(min);
