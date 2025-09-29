'use strict';

const Graph = require('../main.js');
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { misc } = require('naughty-util');

describe('graph', () => {
  describe('undirected', () => {
    let graph = null;

    beforeEach(() => {
      graph = new Graph();
      graph.add('a').add('b').add('c').add('e');
      graph.connect('a', 'b');
      graph.connect('c', 'a');
    });

    it('get edges', () => {
      assert.deepStrictEqual(graph.getOutEdges('c'), ['a']);
      assert.deepStrictEqual(graph.getOutEdges('a'), ['b', 'c']);
      assert.deepStrictEqual(graph.getOutEdges('f'), []);
      assert.deepStrictEqual(graph.getInEdges('c'), ['a']);
      assert.deepStrictEqual(graph.getInEdges('a'), ['b', 'c']);
      assert.deepStrictEqual(graph.getInEdges('f'), []);
    });

    it('has edges', () => {
      graph.connect('c', 'b');
      assert.strictEqual(graph.hasInEdge('c', 'b'), true);
      assert.strictEqual(graph.hasInEdge('c', 'e'), false);
      assert.strictEqual(graph.hasOutEdge('c', 'a'), true);
      assert.strictEqual(graph.hasOutEdge('c', 'e'), false);
    });

    it('disconnect edge', () => {
      assert.deepStrictEqual(graph.getOutEdges('a'), ['b', 'c']);
      assert.deepStrictEqual(graph.getInEdges('a'), ['b', 'c']);
      assert.strictEqual(graph.disconnect('f', 'a'), false);
      assert.strictEqual(graph.disconnect('a', 'f'), false);
      assert.strictEqual(graph.disconnect('a', 'b'), true);
      assert.deepStrictEqual(graph.getOutEdges('a'), ['c']);
      assert.deepStrictEqual(graph.getOutEdges('b'), []);
      assert.deepStrictEqual(graph.getInEdges('b'), []);
      assert.deepStrictEqual(graph.getInEdges('a'), ['c']);
    });

    it('edges', () => {
      assert.deepStrictEqual([...graph.edges()], [['a', 'b'], ['a', 'c']]);
      graph.connect('b', 'a');
      ([...graph.edges()], [['a', 'b'], ['a', 'c'], ['b', 'a']]);
    });

    it('vertices', () => {
      assert.deepStrictEqual(
        [...graph.vertices()],
        [{ value: 'a' }, { value: 'b' }, { value: 'c' }, { value: 'e' }]
      )
    });

    it('has vertex', () => {
      assert.strictEqual(graph.has('a'), true);
      assert.strictEqual(graph.has('f'), false);
      assert.strictEqual(graph.has('e'), true);
    });

    it('update vertex', () => {
      assert.strictEqual(graph.update('a', 42), true);
      assert.strictEqual(graph.update('f', 42), false);
      assert.strictEqual(graph.has(42), true);
      assert.strictEqual(graph.has('a'), false);
    });

    it('delete vertex', () => {
      assert.strictEqual(graph.delete('unknown'), false);

      assert.strictEqual(graph.hasOutEdge('c', 'a'), true);
      assert.strictEqual(graph.hasOutEdge('a', 'c'), true);
      assert.strictEqual(graph.delete('c'), true);
      assert.strictEqual(graph.hasOutEdge('c', 'a'), false);
      assert.strictEqual(graph.hasOutEdge('a', 'c'), false);

      assert.strictEqual(graph.hasInEdge('c', 'b'), false);
      assert.strictEqual(graph.hasOutEdge('c', 'b'), false);
    });

    it('has weights', () => {
      assert.strictEqual(graph.hasWeight('a', 'b'), false);
      assert.strictEqual(graph.hasWeight(42, 1), false);
      assert.strictEqual(graph.hasWeight(1, 'a'), false);
      assert.strictEqual(graph.hasWeight('a', 1), false);
    });

    it('get weights', () => {
      assert.strictEqual(graph.getWeight(2, 3), undefined);
      assert.strictEqual(graph.getWeight('a', 'b'), undefined);
      assert.strictEqual(graph.getWeight('a', 1), undefined);
      assert.strictEqual(graph.getWeight(1, 'a'), undefined);
    });

    it('set weights', () => {
      graph.setWeight('a', 'b', 'b');
      assert.strictEqual(graph.getWeight('a', 'b'), undefined);
      graph.setWeight('a', 4, 'b');
      assert.strictEqual(graph.getWeight('a', 4), undefined);
      graph.setWeight(4, 'b', 'b');
      assert.strictEqual(graph.getWeight(4, 'b'), undefined);
      graph.setWeight(2, 1, 'b');
      assert.strictEqual(graph.getWeight(2, 1), undefined);
    });

    it('connect weights', () => {
      graph.connect(2, 1, 'b');
      assert.strictEqual(graph.hasWeight(2, 1), false);
      graph.connect('a', 1, 'b');
      assert.strictEqual(graph.hasWeight('a', 1), false);
      graph.connect(2, 'a', 'b');
      assert.strictEqual(graph.hasWeight(2, 'a'), false);
      graph.connect('a', 'b', 'b');
      assert.strictEqual(graph.hasWeight('a', 'b'), false);
    });

    it('hasCycles', () => {
      const graph = new Graph();
      assert.strictEqual(graph.hasCycles(), false);
      graph.add('a').add('b');
      assert.strictEqual(graph.hasCycles(), false);
      graph.connect('a', 'a');
      assert.strictEqual(graph.hasCycles(), false);
      graph.connect('a', 'b');
      assert.strictEqual(graph.hasCycles(), true);
    });

    it('delete weight', () => {
      assert.strictEqual(graph.deleteWeight('a', 'b'), false);
    });

    it('degree', () => {
      assert.strictEqual(graph.degree('a'), 2);
      assert.strictEqual(graph.degree('b'), 1);
      assert.strictEqual(graph.degree('e'), 0);
    });

    it('connectivity', () => {
      assert.strictEqual(graph.connectivity('a'), 2);
      assert.strictEqual(graph.connectivity('b'), 1);
      assert.strictEqual(graph.connectivity('e'), 0);
    });

    it('dfs', () => {
      assert.deepStrictEqual([...graph.dfs()], ['a', 'b', 'c']);
      assert.deepStrictEqual([...graph.dfs(null)], []);
      assert.deepStrictEqual([...new Graph().add('a').dfs()], ['a']);
    });

    it('bfs', () => {
      assert.deepStrictEqual([...graph.bfs()], ['a', 'b', 'c']);
      assert.deepStrictEqual([...new Graph().bfs()], []);
      assert.deepStrictEqual([...new Graph().add('a').bfs()], ['a']);
    });

    it('wcc', () => {
      assert.deepStrictEqual(graph.wcc(), [['a', 'b', 'c'], ['e']]);
    });

    it('scc', () => {
      assert.deepStrictEqual(graph.scc(), graph.wcc());
    });

    it('shortPath BFS', () => {
      const graph = new Graph();
      graph.add('A').add('B').add('C').add('D').add('E');
      graph.connect('A', 'B');
      graph.connect('A', 'C');
      graph.connect('B', 'D');
      graph.connect('D', 'E');

      assert.deepStrictEqual(
        graph.shortPath('A', 'E'),
        ['A', 'B', 'D', 'E']
      );

      assert.deepStrictEqual(
        graph.shortPath('G', 'E'),
        []
      );

      assert.deepStrictEqual(
        graph.shortPath('A', 'G'),
        []
      );

      assert.deepStrictEqual(
        graph.shortPath('C', 'E'),
        ['C', 'A', 'B', 'D', 'E']
      );

      assert.deepStrictEqual(
        [...graph.shortPath('A').keys()],
        ['B', 'C', 'D', 'E']
      );
    });
  });

  describe('weighted', () => {
    let graph = null;

    beforeEach(() => {
      graph = new Graph({ weighted: true })
        .add(1).add(2).add(3);
      graph.connect(2, 3, 'a');
    });

    it('has', () => {
      assert.strictEqual(graph.hasWeight(2, 3), true);
      assert.strictEqual(graph.hasWeight(1, 2), false);
      assert.strictEqual(graph.hasWeight(1, 'a'), false);
      assert.strictEqual(graph.hasWeight('a', 1), false);
    });

    it('connect', () => {
      graph.connect(2, 1, 'b');
      assert.strictEqual(graph.hasWeight(2, 1), true);
      assert.strictEqual(graph.hasWeight(1, 2), false);
      graph.connect('a', 'a', 42);
      assert.strictEqual(graph.hasWeight('a', 'a'), false);

      const selfCycled = new Graph({ weighted: true, selfCycling: true });
      selfCycled.add('a');
      selfCycled.connect('a', 'a', 42);
      assert.strictEqual(selfCycled.hasWeight('a', 'a'), true);
      graph.connect('a', 'a', 42);
      assert.strictEqual(graph.hasWeight('a', 'a'), false);
    });

    it('get', () => {
      assert.strictEqual(graph.getWeight(2, 3), 'a');
      assert.strictEqual(graph.getWeight(1, 2), undefined);
      assert.strictEqual(graph.getWeight(1, 'a'), undefined);
      assert.strictEqual(graph.getWeight('a', 1), undefined);
    });

    it('set', () => {
      assert.strictEqual(graph.getWeight(2, 3), 'a');
      graph.setWeight(2, 3, 'b');
      assert.strictEqual(graph.getWeight(2, 3), 'b');
      graph.setWeight(3, 4, 'b');
      assert.strictEqual(graph.getWeight(3, 4), undefined);
      graph.setWeight(4, 3, 'b');
      assert.strictEqual(graph.getWeight(4, 3), undefined);
      graph.setWeight(1, 1, 'b');
      assert.strictEqual(graph.getWeight(4, 3), undefined);
      const selfCycled = new Graph({ weighted: true, selfCycling: true });
      selfCycled.add(1);
      selfCycled.setWeight(1, 1, 42);
      assert.strictEqual(selfCycled.getWeight(1, 1), 42);
      assert.strictEqual(graph.getWeight(1, 1), undefined);
    });

    it('delete', () => {
      assert.strictEqual(graph.getWeight(2, 3), 'a');
      assert.strictEqual(graph.deleteWeight(2, 3), true);
      assert.strictEqual(graph.getWeight(2, 3), undefined);
      assert.strictEqual(graph.deleteWeight('a', 4), false)
      assert.strictEqual(graph.getWeight('a', 4), undefined);
      assert.strictEqual(graph.deleteWeight(4, 'a'), false)
      assert.strictEqual(graph.getWeight(4, 'a'), undefined);
      assert.strictEqual(graph.deleteWeight('b', 'a'), false)
      assert.strictEqual(graph.getWeight('b', 'a'), undefined);
      assert.strictEqual(graph.deleteWeight(1, 3), false);
      assert.strictEqual(graph.deleteWeight(1, 'a'), false);
    });

    it('disconnect', () => {
      assert.strictEqual(graph.getWeight(2, 3), 'a');
      assert.strictEqual(graph.disconnect(2, 3), true);
      assert.strictEqual(graph.getWeight(2, 3), undefined);
    });

    it('delete vertex', () => {
      assert.strictEqual(graph.getWeight(2, 3), 'a');
      assert.strictEqual(graph.delete(2), true);
      assert.strictEqual(graph.getWeight(2, 3), undefined);
    });

    describe("Dijkstra short path only positive weights", () => {
      describe('directed', () => {
        it('from/to', () => {
          const graph = new Graph({ weighted: true, directed: true });
          graph.add('a').add('b').add('c').add('d');
          graph.connect('a', 'b', 1);
          graph.connect('a', 'c', 4);
          graph.connect('b', 'c', 2);
          graph.connect('b', 'd', 6);
          graph.connect('c', 'd', 3);
          const { distance, cost, path } = graph.shortPathWeighted({ from: 'a', to: 'd' });
          assert.strictEqual(distance, null);
          assert.strictEqual(cost, 6);
          assert.deepStrictEqual(path, ['a', 'b', 'c', 'd']);
        });

        it('from', () => {
          const graph = new Graph({ weighted: true, directed: true });
          graph.add('a').add('b').add('c').add('d');
          graph.connect('a', 'b', 1);
          graph.connect('a', 'c', 4);
          graph.connect('b', 'c', 2);
          graph.connect('b', 'd', 6);
          graph.connect('c', 'd', 3);
          const { distance, cost, path } = graph.shortPathWeighted({ from: 'a' });
          assert.deepStrictEqual(distance, new Map([['b', 1], ['c', 3], ['d', 6]]));
          assert.strictEqual(cost, -1);
          assert.strictEqual(path, null);
        });
      });

      describe('undirected', () => {
        it('from/to', () => {
          const graph = new Graph({ weighted: true });
          graph.add('a').add('b').add('c').add('d');
          graph.connect('a', 'b', 1);
          graph.connect('a', 'c', 4);
          graph.connect('b', 'c', 2);
          graph.connect('b', 'd', 6);
          graph.connect('c', 'd', 3);
          const { distance, cost, path } = graph.shortPathWeighted({ from: 'a', to: 'd' });
          assert.strictEqual(distance, null);
          assert.strictEqual(cost, 6);
          assert.deepStrictEqual(path, ['a', 'b', 'c', 'd']);
        });

        it('from', () => {
          const graph = new Graph({ weighted: true });
          graph.add('a').add('b').add('c').add('d');
          graph.connect('a', 'b', 1);
          graph.connect('a', 'c', 4);
          graph.connect('b', 'c', 2);
          graph.connect('b', 'd', 6);
          graph.connect('c', 'd', 3);
          const { distance, cost, path } = graph.shortPathWeighted({ from: 'a' });
          assert.deepStrictEqual(distance, new Map([['b', 1], ['c', 3], ['d', 6]]));
          assert.strictEqual(cost, -1);
          assert.strictEqual(path, null);
        });
      });
    });

    describe("Bellman-Ford short path positive/negative weights", () => {
      it('Bellman-Ford - positive weights', () => {
        const graph = new Graph({ directed: true, weighted: true });
        graph.add('A').add('B').add('C');
        graph.connect('A', 'B', 2);
        graph.connect('B', 'C', 3);
        const result = graph.shortPathWeighted({ from: 'A', to: 'C', negativeWeights: true });
        assert.deepStrictEqual(result.path, ['A', 'B', 'C']);
        assert.strictEqual(result.distance, 5);
      });

      it('Bellman-Ford - negative weight', () => {
        const graph = new Graph({ directed: true, weighted: true });
        graph.add('A').add('B').add('C');
        graph.connect('A', 'B', 2);
        graph.connect('B', 'C', -1);
        const result = graph.shortPathWeighted({ from: 'A', to: 'C', negativeWeights: true });
        assert.deepStrictEqual(result.path, ['A', 'B', 'C']);
        assert.strictEqual(result.distance, 1);
      });

      it('Bellman-Ford - negative cycle', () => {
        const graph = new Graph({ directed: true, weighted: true });
        graph.add('A').add('B').add('C');
        graph.connect('A', 'B', 1);
        graph.connect('B', 'C', -2);
        graph.connect('C', 'A', -2);
        const result = graph.shortPathWeighted({ from: 'A', to: 'C', negativeWeights: true });
        assert.strictEqual(result.cycle, true);
      });

      describe('Bellman-Ford - no destination', () => {
        it('wrong from parameter', () => {
          const graph = new Graph({ directed: true, weighted: true });
          graph.add('A').add('B').add('C');
          graph.connect('A', 'B', 1);
          graph.connect('B', 'C', 2);
          const result = graph.shortPathWeighted({ from: 'D' });
          assert.strictEqual(result, null);
        });

        it('all positive', () => {
          const graph = new Graph({ directed: true, weighted: true });
          graph.add('A').add('B').add('C');
          graph.connect('A', 'B', 1);
          graph.connect('B', 'C', 2);
          const result = graph.shortPathWeighted({ from: 'A', negativeWeights: true });
          const expected = [
            { distance: 1, path: ['A', 'B'], cycle: false },
            { distance: 3, path: ['A', 'B', 'C'], cycle: false }
          ];
          for (const { 0: res, 1: index } of misc.enumerate(result)) {
            const exp = expected[index];
            assert.strictEqual(res.distance, exp.distance);
            assert.deepStrictEqual(res.path, exp.path);
            assert.strictEqual(res.cycle, exp.cycle);
          }
        });

        it('all positive one connection', () => {
          const graph = new Graph({ directed: true, weighted: true });
          graph.add('A').add('B').add('C').add('D');
          graph.connect('A', 'B', 1);
          graph.connect('C', 'D', 1);
          const result = graph.shortPathWeighted({ from: 'A', negativeWeights: true });
          const expected = [
            { distance: 1, path: ['A', 'B'], cycle: false },
            { distance: Infinity, path: ['C'], cycle: false },
            { distance: Infinity, path: ['D'], cycle: false }
          ];
          for (const { 0: res, 1: index } of misc.enumerate(result)) {
            const exp = expected[index];
            assert.strictEqual(res.distance, exp.distance);
            assert.deepStrictEqual(res.path, exp.path);
            assert.strictEqual(res.cycle, exp.cycle);
          }
        });

        it('negative/positive', () => {
          const graph = new Graph({ directed: true, weighted: true });
          graph.add('A').add('B').add('C');
          graph.connect('A', 'B', 3);
          graph.connect('B', 'C', -2);
          const result = graph.shortPathWeighted({ from: 'A', negativeWeights: true });
          const expected = [
            { distance: 3, path: ['A', 'B'], cycle: false },
            { distance: 1, path: ['A', 'B', 'C'], cycle: false }
          ];
          for (const { 0: res, 1: index } of misc.enumerate(result)) {
            const exp = expected[index];
            assert.strictEqual(res.distance, exp.distance);
            assert.deepStrictEqual(res.path, exp.path);
            assert.strictEqual(res.cycle, exp.cycle);
          }
        });

        it('negative/positive cycle', () => {
          const graph = new Graph({ directed: true, weighted: true });
          graph.add('A').add('B').add('C');
          graph.connect('A', 'B', 1);
          graph.connect('B', 'C', -2);
          graph.connect('C', 'A', -2);
          const result = graph.shortPathWeighted({ from: 'A', negativeWeights: true });
          const expected = [
            { distance: -2, path: ['A', 'B', 'C', 'A', 'B'], cycle: true },
            { distance: -4, path: ['B', 'C', 'A', 'B', 'C'], cycle: true }
          ];
          for (const { 0: res, 1: index } of misc.enumerate(result)) {
            const exp = expected[index];
            assert.strictEqual(res.distance, exp.distance);
            assert.deepStrictEqual(res.path, exp.path);
            assert.strictEqual(res.cycle, exp.cycle);
          }
        });
      });
    });
  });

  describe('directed', () => {
    let graph = null;

    beforeEach(() => {
      graph = new Graph({ directed: true });
      graph.add('a').add('b').add('c').add('e');
      graph.add('a');
      graph.connect('a', 'b');
      graph.connect('c', 'a');
    });

    it('get edges', () => {
      assert.deepStrictEqual(
        graph.getOutEdges('c'),
        ['a']
      );
      assert.deepStrictEqual(
        graph.getOutEdges('b'),
        []
      );
      graph.connect('c', 'b');
      assert.deepStrictEqual(
        graph.getInEdges('c'),
        []
      );
      assert.deepStrictEqual(
        graph.getInEdges('b'),
        ['a', 'c']
      );
    });

    it('has edges', () => {
      assert.strictEqual(graph.hasInEdge('c', 'b'), false);
      assert.strictEqual(graph.hasInEdge('a', 'b'), false);
      assert.strictEqual(graph.hasInEdge('a', 'c'), true);
      assert.strictEqual(graph.hasOutEdge('c', 'a'), true);
      assert.strictEqual(graph.hasOutEdge('c', 'd'), false);
    });

    it('delete edges', () => {
      assert.strictEqual(graph.delete('unknown'), false);
      assert.strictEqual(graph.hasInEdge('a', 'c'), true);
      assert.strictEqual(graph.hasOutEdge('c', 'a'), true);
      assert.strictEqual(graph.delete('c'), true);
      assert.strictEqual(graph.hasInEdge('a', 'c'), false);
      assert.strictEqual(graph.hasOutEdge('c', 'a'), false);
    });

    it('disconnect edge', () => {
      assert.deepStrictEqual(graph.getOutEdges('a'), ['b']);
      assert.strictEqual(graph.disconnect('f', 'a'), false);
      assert.strictEqual(graph.disconnect('a', 'f'), false);
      assert.strictEqual(graph.disconnect('a', 'b'), true);
      assert.deepStrictEqual(graph.getOutEdges('a'), []);
    });

    it('has vertex', () => {
      assert.strictEqual(graph.has('a'), true);
      assert.strictEqual(graph.has('f'), false);
      assert.strictEqual(graph.has('e'), true);
    });

    it('update vertex', () => {
      assert.strictEqual(graph.update('a', 42), true);
      assert.strictEqual(graph.update('f', 42), false);
      assert.strictEqual(graph.has(42), true);
      assert.strictEqual(graph.has('a'), false);
    });

    it('degree', () => {
      assert.strictEqual(graph.degree('a'), 1);
      assert.strictEqual(graph.degree('c'), 1);
      assert.strictEqual(graph.degree('e'), 0);
      assert.strictEqual(graph.degree('b'), 0);
    });

    it('connectivity', () => {
      assert.strictEqual(graph.connectivity('a'), 1);
      assert.strictEqual(graph.connectivity('c'), 0);
      assert.strictEqual(graph.connectivity('e'), 0);
      assert.strictEqual(graph.connectivity('b'), 1);
    });

    it('scc', () => {
      assert.deepStrictEqual(graph.scc(), [['e'], ['c',], ['a',], ['b']]);
      graph.connect('b', 'c');
      assert.deepStrictEqual(graph.scc(), [['e'], ['b', 'c', 'a']]);
    });

    it('hasCycles', () => {
      const graph = new Graph({ directed: true });
      assert.strictEqual(graph.hasCycles(), false);
      graph.add('a').add('b');
      assert.strictEqual(graph.hasCycles(), false);
      graph.connect('a', 'a');
      assert.strictEqual(graph.hasCycles(), false);
      graph.connect('a', 'b');
      assert.strictEqual(graph.hasCycles(), false);
      graph.connect('c', 'a');
      assert.strictEqual(graph.hasCycles(), false);
      graph.connect('c', 'b');
      assert.strictEqual(graph.hasCycles(), false);
      graph.connect('b', 'a');
      assert.strictEqual(graph.hasCycles(), true);
    });

    it('topological sort basic DAG', () => {
      const graph = new Graph({ directed: true });
      graph.add('a').add('b').add('c').add('d');
      graph.connect('a', 'b');
      graph.connect('a', 'c');
      graph.connect('c', 'b');
      graph.connect('b', 'd');
      assert.deepStrictEqual(graph.topologicalSort(), ['a', 'c', 'b', 'd']);
      graph.connect('b', 'a');
      assert.deepStrictEqual(graph.topologicalSort(), []);
    });

    it('shortPath BFS ', () => {
      const graph = new Graph({ directed: true });
      graph.add('X').add('Y').add('Z').add('W');
      graph.connect('X', 'Y');
      graph.connect('X', 'Z');
      graph.connect('Y', 'W');
      graph.connect('Z', 'W');

      assert.deepStrictEqual(
        graph.shortPath('X', 'W'),
        ['X', 'Y', 'W']
      );

      assert.deepStrictEqual(
        graph.shortPath('Z', 'Y'),
        []
      );

      assert.deepStrictEqual(
        [...graph.shortPath('X').keys()],
        ['Y', 'Z', 'W']
      );
    });
  });
});
