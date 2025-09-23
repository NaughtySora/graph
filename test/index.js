'use strict';

const Graph = require('../main.js');
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('graph', () => {
  describe('undirected', () => {
    let graph = null;

    beforeEach(() => {
      graph = new Graph();
      graph.add('a').add('b').add('c').add('e');
      graph.connect('a', 'b');
      graph.connect('c', 'a');
    });

    it.skip('get edges', () => {
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
        ['a', 'b']
      );
      assert.deepStrictEqual(
        graph.getInEdges('b'),
        []
      );
    });

    it.skip('has edges', () => {
      graph.connect('c', 'b');
      assert.strictEqual(graph.hasInEdge('c', 'b'), true);
      assert.strictEqual(graph.hasInEdge('c', 'e'), false);
      assert.strictEqual(graph.hasOutEdge('c', 'a'), true);
      assert.strictEqual(graph.hasOutEdge('c', 'e'), false);
    });

    it.skip('delete edges', () => {
      assert.strictEqual(graph.delete('unknown'), false);
      assert.strictEqual(graph.delete('c'), true);
      assert.strictEqual(graph.hasInEdge('c', 'b'), false);
      assert.strictEqual(graph.hasOutEdge('c', 'b'), false);
    });

    it.skip('disconnect edge', () => {
      assert.deepStrictEqual(graph.getOutEdges('a'), ['b']);
      assert.strictEqual(graph.disconnect('f', 'a'), false);
      assert.strictEqual(graph.disconnect('a', 'f'), false);
      assert.strictEqual(graph.disconnect('a', 'b'), true);
      assert.deepStrictEqual(graph.getOutEdges('a'), []);
    });

    it.skip('edges', () => {
      assert.deepStrictEqual([...graph.edges()], [['a', 'b'], ['c', 'a']]);
      graph.connect('b', 'a');
      assert.deepStrictEqual([...graph.edges()], [['a', 'b'], ['b', 'a'], ['c', 'a']]);
    });

    it.skip('vertices', () => {
      assert.deepStrictEqual(
        [...graph.vertices()],
        [{ value: 'a' }, { value: 'b' }, { value: 'c' }, { value: 'e' }]
      )
    });

    it.skip('has vertex', () => {
      assert.strictEqual(graph.has('a'), true);
      assert.strictEqual(graph.has('f'), false);
      assert.strictEqual(graph.has('e'), true);
    });

    it.skip('update vertex', () => {
      assert.strictEqual(graph.update('a', 42), true);
      assert.strictEqual(graph.update('f', 42), false);
      assert.strictEqual(graph.has(42), true);
      assert.strictEqual(graph.has('a'), false);
    });

    it.skip('has weights', () => {
      assert.strictEqual(graph.hasWeight('a', 'b'), false);
      assert.strictEqual(graph.hasWeight(42, 1), false);
      assert.strictEqual(graph.hasWeight(1, 'a'), false);
      assert.strictEqual(graph.hasWeight('a', 1), false);
    });

    it.skip('get weights', () => {
      assert.strictEqual(graph.getWeight(2, 3), undefined);
      assert.strictEqual(graph.getWeight('a', 'b'), undefined);
      assert.strictEqual(graph.getWeight('a', 1), undefined);
      assert.strictEqual(graph.getWeight(1, 'a'), undefined);
    });

    it.skip('set weights', () => {
      graph.setWeight('a', 'b', 'b');
      assert.strictEqual(graph.getWeight('a', 'b'), undefined);
      graph.setWeight('a', 4, 'b');
      assert.strictEqual(graph.getWeight('a', 4), undefined);
      graph.setWeight(4, 'b', 'b');
      assert.strictEqual(graph.getWeight(4, 'b'), undefined);
      graph.setWeight(2, 1, 'b');
      assert.strictEqual(graph.getWeight(2, 1), undefined);
    });

    it.skip('connect weights', () => {
      graph.connect(2, 1, 'b');
      assert.strictEqual(graph.hasWeight(2, 1), false);
      graph.connect('a', 1, 'b');
      assert.strictEqual(graph.hasWeight('a', 1), false);
      graph.connect(2, 'a', 'b');
      assert.strictEqual(graph.hasWeight(2, 'a'), false);
      graph.connect('a', 'b', 'b');
      assert.strictEqual(graph.hasWeight('a', 'b'), false);
    });

    it.skip('delete weight', () => {
      assert.strictEqual(graph.deleteWeight('a', 'b'), false);
    });

    it.skip('dfs', () => {
      assert.deepStrictEqual([...graph.dfs()], ['a', 'b']);
      assert.deepStrictEqual([...graph.dfs(null)], []);
    });

    it.skip('bfs', () => {
      assert.deepStrictEqual([...graph.bfs()], ['a', 'b']);
      assert.deepStrictEqual([...new Graph().bfs()], []);
    });

    it('wcc', () => {
      assert.deepStrictEqual(graph.wcc(), [['a', 'b', 'c'], ['e']]);
    });
  });

  describe.skip('weighted', () => {
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
  });

  describe.skip('directed', () => {
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
  });
});
