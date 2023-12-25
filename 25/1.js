const fs = require('node:fs');

const graph = fs.readFileSync('data.txt', 'utf8')
    .split("\r\n")
    .reduce((acc, line) => {
        const [src, dst] = line.split(': ');
        return {
            ...acc,
            [src]: [...(acc[src] ?? []), ...dst.split(' ')],
            ...dst.split(' ').reduce((dAcc, d) => ({
                ...dAcc,
                [d]: [...(acc[d] ?? []), src],
            }), {}),
        };
    }, {});

const nodesCount = Object.keys(graph).length;

const findEdge = () => {
    const count = {};
    Object.keys(graph).forEach(start => {
        let visited = [start];
        let i = 0;

        while (visited.length < nodesCount) {
            const src = visited[i];
            const newNodes = graph[src].filter(dst => !visited.includes(dst));
            newNodes.forEach(dst => {
                const edge = [src, dst];
                edge.sort();
                count[`${edge[0]}-${edge[1]}`] = (count[`${edge[0]}-${edge[1]}`] ?? 0) + 1;
            });
            visited = [...visited, ...newNodes];
            i++;
        }
    });

    const maxUsage = Math.max(...Object.values(count));
    const edge = Object.entries(count).find(([_, value]) => value === maxUsage)[0];
    return edge.split('-');
}

[...Array(3)].forEach(() => {
    const [v1, v2] = findEdge();
    graph[v1] = graph[v1].filter(v => v !== v2);
    graph[v2] = graph[v2].filter(v => v !== v1);
});

let visited = [Object.keys(graph)[0]];
let i = 0;
while (i < visited.length) {
    const src = visited[i];
    const newNodes = graph[src].filter(dst => !visited.includes(dst));

    visited = [...visited, ...newNodes];
    i++;
}

console.log(visited.length * (nodesCount - visited.length));