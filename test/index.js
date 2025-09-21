'use strict';

const Graph = require('../main.js');
const { describe, it } = require('node:test');
const assert = require('node:assert');


describe('graph', () => {
  describe('undirected', () => {
    it('add/edge', () => {
      const graph = new Graph();
      graph.add('a').add('b').add('c');
      graph.edge('a', 'b');
      graph.edge('c', 'a');
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
  });
});