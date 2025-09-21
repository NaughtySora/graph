'use strict';

const Graph = require('../main.js');
const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('graph', () => {
  describe('undirected', () => {
    const graph = new Graph();
    graph.add('a').add('b').add('c').add('e');
    graph.edge('a', 'b');
    graph.edge('c', 'a');

    it('get edges', () => {
      assert.deepStrictEqual(
        graph.getOutEdges('c').map(item => item.value),
        ['a']
      );
      graph.edge('c', 'b');
      assert.deepStrictEqual(
        graph.getInEdges('c').map(item => item.value),
        ['a', 'b']
      );
    });

    it('has edges', () => {
      assert.strictEqual(graph.hasInEdges('c', 'b'), true);
      assert.strictEqual(graph.hasInEdges('c', 'e'), false);
      assert.strictEqual(graph.hasOutEdges('c', 'a'), true);
      assert.strictEqual(graph.hasOutEdges('c', 'e'), false);
    });
  });
});