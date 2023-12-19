const fs = require('node:fs');

const parseRule = rule => {
    if (rule.includes(':')) {
        const [condition, destination] = rule.split(':');
        if (condition.includes('>')) {
            const [category, amount] = condition.split('>');
            return { condition: part => part[category] > +amount, destination };
        }
        const [category, amount] = condition.split('<');
        return { condition: part => part[category] < +amount, destination };
    }
    return { condition: () => true, destination: rule };
};

const data = fs.readFileSync('data.txt', 'utf8').split("\r\n");
const emptyRow = data.findIndex(data => !data);
const workflows = data.slice(0, emptyRow).reduce((acc, workflow) => {
    const [name, rules] = workflow.split('{');
    return {
        ...acc,
        [name]: rules.slice(0, -1).split(',').map(parseRule),
    };
}, {});
const parts = data.slice(emptyRow + 1).map(part => {
    const categories = part.slice(1, -1).split(',');
    return categories.reduce((acc, category) => {
        const [name, amount] = category.split('=');
        return {
            ...acc,
            [name]: +amount,
        };
    }, {});
});

const move = (part, workflowName) => {
    const workflow = workflows[workflowName];
    const destination = workflow.find(({ condition }) => condition(part)).destination;
    if (destination === 'A') {
        return true;
    }
    if (destination === 'R') {
        return false;
    }
    return move(part, destination);
};

const rating = parts.filter(part => move(part, 'in')).reduce((acc, part) => acc + part.x + part.m + part.a + part.s, 0);
console.log(rating);