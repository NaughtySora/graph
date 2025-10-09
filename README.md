# Graph (adjacency list, no compressing) 
**current implementation isn't for dense graphs with a lot of vertices**

## Examples

### vertex degree, shortest unweighted path from a to e
```js
  const graph = new Graph();
  graph.add('a').add('b').add('c').add('e');
  graph.connect('a', 'b').connect('c', 'a').connect('e', 'c');
  
  const aDegree = graph.degree('a');
  const shortest = graph.shortPath('a', 'e');
```

### Negative weights shortest path
```js
  const graph = new Graph({ weighted: true, directed: true });
  graph.add('a').add('b').add('c').add('e');
  graph.connect('a', 'b', 42).connect('c', 'a', 74).connect('e', 'c', -33);
  
  const shortest = graph.shortPathWeighted({ 
    from: 'a',
    to: 'e', 
    negativeWeights: true,
  });
```

### Minimum spanning tree 
```js 
  const graph = new Graph({ weighted: true, });
  graph.add('a').add('b').add('c').add('e');
  graph.connect('a', 'b', 42).connect('c', 'a', 74).connect('e', 'c', -33);
  const tree = graph.mst();
```


### Strongly connected component
```js 
  const graph = new Graph({ directed: true });
  graph.add('a').add('b').add('c').add('e');
  graph.connect('a', 'b').connect('c', 'a').connect('e', 'c');
  const scc = graph.scc();
```