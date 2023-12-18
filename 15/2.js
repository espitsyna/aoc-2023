const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split(",");

const parseStep = step => {
    if (step.at(-1) === '-') {
        return [step.slice(0, -1), '-'];
    }

    const [label, focal] = step.split('=');
    return  [label, '=', focal];
};

const boxes = [...Array(256)].map(() => []);
data.forEach(step => {
    const [label, operation, focal] = parseStep(step);
    const boxId = label.split('').reduce((acc, c) => {
        const code = c.charCodeAt(0);
        return ((acc + code) * 17) % 256;
    }, 0);

    const box = boxes[boxId];
    const i = box.findIndex(lens => lens.label === label);
    switch (operation) {
        case '=':
            if (i === -1) {
                box.push({ label, focal });
            } else {
                box[i].focal = focal;
            }
            break;
        case '-':
            if (i !== -1) {
                boxes[boxId] = [...box.slice(0, i), ...box.slice(i + 1)];
            }
            break;
    }
});

const sum = boxes.reduce((acc, box, i) => {
    return acc + box.reduce((acc, lens, j) => acc + ((i + 1) * lens.focal * (j + 1)), 0)
}, 0);
console.log(sum);