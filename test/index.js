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

    it('get edges', () => {
      assert.deepStrictEqual(
        graph.getOutEdges('c').map(item => item.value),
        ['a']
      );
      graph.connect('c', 'b');
      assert.deepStrictEqual(
        graph.getInEdges('c').map(item => item.value),
        ['a', 'b']
      );
    });

    it('has edges', () => {
      graph.connect('c', 'b');
      assert.strictEqual(graph.hasInEdges('c', 'b'), true);
      assert.strictEqual(graph.hasInEdges('c', 'e'), false);
      assert.strictEqual(graph.hasOutEdges('c', 'a'), true);
      assert.strictEqual(graph.hasOutEdges('c', 'e'), false);
    });

    it('delete edges', () => {
      assert.strictEqual(graph.delete('unknown'), false);
      assert.strictEqual(graph.delete('c'), true);
      assert.strictEqual(graph.hasInEdges('c', 'b'), false);
      assert.strictEqual(graph.hasOutEdges('c', 'b'), false);
    });

    it('edges', () => {
      assert.deepStrictEqual([...graph.edges()], [['a', 'b'], ['c', 'a']]);
      graph.connect('b', 'a');
      assert.deepStrictEqual([...graph.edges()], [['a', 'b'], ['b', 'a'], ['c', 'a']]);
    });

    it('vertices', () => {
      assert.deepStrictEqual(
        [...graph.vertices()],
        [{ value: 'a' }, { value: 'b' }, { value: 'c' }, { value: 'e' }]
      )
    });
  });
});
