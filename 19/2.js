const fs = require('node:fs');

const fullRange = () => ({
    x: { bottom: 1, top: 4000 },
    m: { bottom: 1, top: 4000 },
    a: { bottom: 1, top: 4000 },
    s: { bottom: 1, top: 4000 },
});

const parseRule = rule => {
    const range = fullRange();
    const invertedRange = fullRange();
    if (rule.includes(':')) {
        const [condition, destination] = rule.split(':');
        if (condition.includes('>')) {
            const [category, amount] = condition.split('>');
            range[category].bottom = +amount + 1;
            invertedRange[category].top = +amount;
            return { range, invertedRange, destination };
        }
        const [category, amount] = condition.split('<');
        range[category].top = +amount - 1;
        invertedRange[category].bottom = +amount;
        return { range, invertedRange, destination };
    }
    return { range, invertedRange, destination: rule };
};

const mergeRanges = (a, b) => {
    return {
        x: { bottom: Math.max(a.x.bottom, b.x.bottom), top: Math.min(a.x.top, b.x.top) },
        m: { bottom: Math.max(a.m.bottom, b.m.bottom), top: Math.min(a.m.top, b.m.top) },
        a: { bottom: Math.max(a.a.bottom, b.a.bottom), top: Math.min(a.a.top, b.a.top) },
        s: { bottom: Math.max(a.s.bottom, b.s.bottom), top: Math.min(a.s.top, b.s.top) },
    };
};

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n");
const emptyRow = data.findIndex(data => !data);
const workflows = data.slice(0, emptyRow).reduce((acc, workflow) => {
    const [name, rules] = workflow.split('{');
    const parsedRules = rules.slice(0, -1).split(',').map(parseRule);
    return {
        ...acc,
        [name]: parsedRules.map((rule, index) => ({
            ...rule,
            range: parsedRules
                .slice(0, index)
                .reduce((acc, { invertedRange }) => mergeRanges(acc, invertedRange), rule.range),
        })),
    };
}, {});


const ranges = [];
const moveBackward = (destination, range) => {
    if (destination === 'in') {
        ranges.push(range);
    }

    const prevSteps = [];
    Object.entries(workflows).forEach(([name, rules]) => {
        rules
            .filter(rule => rule.destination === destination)
            .forEach(rule => prevSteps.push([name, rule]));
    });

    prevSteps.map(([name, rule]) => {
        moveBackward(name, mergeRanges(range, rule.range));
    });
};

moveBackward('A', fullRange());

const intersect = (range1, range2) => {
    const calc = (a, b) =>  Math.max(1 + Math.min(a.top, b.top) - Math.max(a.bottom, b.bottom), 0);
    return calc(range1.x, range2.x) * calc(range1.m, range2.m) * calc(range1.a, range2.a) * calc(range1.s, range2.s);
};

const sum = ranges.reduce((acc, range, index) => {
    const x = 1 + range.x.top - range.x.bottom;
    const m = 1 + range.m.top - range.m.bottom;
    const a = 1 + range.a.top - range.a.bottom;
    const s = 1 + range.s.top - range.s.bottom;

    const size = x * m * a * s;
    return acc + ranges.slice(0, index).reduce((acc, prevRange) => acc - intersect(range, prevRange), size);
}, 0);

console.log(sum);
