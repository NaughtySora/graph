'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert');
const DSU = require('../lib/DSU.js');

describe.only('DSU', () => {
  it('add', () => {
    const dsu = new DSU();
    dsu.add('33').add(1).add(2).add(3).add(4);
    dsu.union(1, '33');
    dsu.union(2, '33');
    dsu.union(3, 2);
    dsu.debug();
    console.log(dsu.root(3));
    dsu.debug();
  });
});
