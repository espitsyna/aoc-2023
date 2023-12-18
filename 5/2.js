const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n");

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

const seedsInput = data[0].split(': ').at(-1).split(' ').map(n => +n);
const seeds = seedsInput.filter((_, index) => index % 2 === 0).reduce((acc, start, index) => {
    const range = seedsInput[index * 2 + 1];
    return [...acc, { start, range }];
}, []);

const isRuleApplied = (point, [, src, range]) => point >= src && point <= src + range;
const getRuleAppliedToAll = (map, { start, range }) => map.find(rule => isRuleApplied(start, rule) && isRuleApplied(start + range, rule));
const getRulesAppliedToSome = (map, { start, range }) => map.filter(rule => isRuleApplied(start, rule) !== isRuleApplied(start + range, rule));

const getRuleStartPoint = ([, src], { start }) => Math.max(start, src);
const getRuleEndPoint = ([, src, r], { start, range }) => Math.min(src + r, start + range);

const res = maps.reduce((acc, map, index) => {
    const out = [];
    acc.forEach(seed => {
        const { start, range } = seed;

        const ruleToAll = getRuleAppliedToAll(map, seed);

        if (ruleToAll) {
            const [dst, src] = ruleToAll;
            out.push({ start: dst + start - src, range });
            return;
        }

        const rulesToSome = getRulesAppliedToSome(map, seed).sort((a, b) => {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        });

        if (!rulesToSome.length) {
            out.push({ start, range });
            return;
        }

        rulesToSome.forEach((rule, index) => {
            const ruleStart = getRuleStartPoint(rule, seed);
            const ruleEnd = getRuleEndPoint(rule, seed);

            const previousRuleEnd = index === 0 ? start : getRuleEndPoint(rulesToSome[index - 1], seed) + 1;

            const [dst, src] = rule;

            if (ruleStart - previousRuleEnd > 0) {
                out.push({ start: previousRuleEnd, range: ruleStart - previousRuleEnd });
            }

            out.push({ start: dst + ruleStart - src, range: ruleEnd - ruleStart });
        });

        const lastRuleEnd = getRuleEndPoint(rulesToSome.at(-1), seed) + 1;
        if (start + range - lastRuleEnd > 0) {
            out.push({ start: lastRuleEnd, range: start + range - lastRuleEnd });
        }
    });
    return out;
}, seeds);

const min = Math.min(...res.map(({ start }) => start).filter(Boolean));
console.log(min);

