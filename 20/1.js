const fs = require('node:fs');

const BUTTON = 'button';
const BROADCASTER = 'broadcaster';
const TOGGLE = '%';
const CONJ = '&';

const LOW = -1;
const HIGH = 1;

const parseSource = src => src === BROADCASTER ?
    { name: src, type: src } :
    { name: src.slice(1), type: src[0] };

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n");

const modules = data.reduce((acc, module) => {
    const [src, dst] = module.split(' -> ');
    const { name, type } = parseSource(src);
    return {
        ...acc,
        [name]: {
            type,
            dst: dst.split(', '),
            state: LOW,
        },
    };
}, {});

Object.entries(modules).filter(([_, { type }]) => type === CONJ).forEach(([name]) => {
    const sources = Object.entries(modules).filter(([_, { dst }]) => dst.includes(name)).map(([name]) => name);
    modules[name].state = sources.reduce((acc, src) => ({ ...acc, [src]: LOW }), {});
});

let signals = {
    [LOW]: 0,
    [HIGH]: 0,
};

const passSignal = (from, to, signal) => {
    signals[signal]++;
    if (!modules[to]) {
        return [];
    }

    const { type, dst, state } = modules[to];

    switch (type) {
        case TOGGLE:
            if (signal === HIGH) {
                return [];
            }
            modules[to].state = -state;
            return dst.map(d => [to, d, -state]);
        case CONJ:
            modules[to].state[from] = signal;
            const resultSignal = Object.values(modules[to].state).every(v => v === HIGH) ? LOW : HIGH;
            return dst.map(d => [to, d, resultSignal]);
        case BROADCASTER:
            return dst.map(d => [to, d, signal]);
        default:
            return [];
    }
};

const push = () => {
    let queue = [[BUTTON, BROADCASTER, LOW]];
    while (queue.length) {
        const message = queue.pop();
        queue = [...passSignal(...message).reverse(), ...queue];
    }
};

[...Array(1000)].forEach(push);
console.log(signals[LOW] * signals[HIGH]);