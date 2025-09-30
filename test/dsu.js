'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const DSU = require('../lib/DSU.js');

describe('DSU', () => {
  let dsu = new DSU();

  beforeEach(() => {
    dsu = new DSU();
    dsu.add('a').add('b').add('c').add('d').add('e');
  });

  it('add', () => {
    assert.strictEqual(dsu.root('a'), 0);
    assert.strictEqual(dsu.root('b'), 1);
    dsu.add('b');
    assert.strictEqual(dsu.root('b'), 1);
    assert.strictEqual(dsu.root('c'), 2);
    assert.strictEqual(dsu.root('d'), 3);
    assert.strictEqual(dsu.root('e'), 4);
  });

  it('union', () => {
    dsu.union('a', 'b');
    dsu.union('c', 'd');
    assert.strictEqual(dsu.connected('a', 'b'), true);
    assert.strictEqual(dsu.connected('c', 'd'), true);
    dsu.union('c', 'd');
    assert.strictEqual(dsu.connected('c', 'd'), true);
    assert.strictEqual(dsu.connected('a', 'c'), false);
    dsu.union('b', 'c');
    assert.strictEqual(dsu.connected('a', 'e'), false);
  });

  it('size', () => {
    dsu.union('a', 'b');
    dsu.union('c', 'd');
    dsu.union('b', 'c');
    assert.strictEqual(dsu.size('a'), 4);
    assert.strictEqual(dsu.size('b'), 4);
    assert.strictEqual(dsu.size('c'), 4);
    assert.strictEqual(dsu.size('d'), 4);
    assert.strictEqual(dsu.size('e'), 1);
  });

  it('root', () => {
    dsu.union('a', 'b');
    dsu.union('c', 'd');
    dsu.union('b', 'c');
    const rootBefore = dsu.root('d');
    dsu.root('d');
    const rootAfter = dsu.root('d');
    assert.strictEqual(rootBefore, rootAfter);
    assert.strictEqual(dsu.root('z'), -1);
  });

  it('find', () => {
    assert.strictEqual(dsu.find(dsu.root('a')), 'a');
    assert.strictEqual(dsu.find(dsu.root('b')), 'b');
    dsu.union('a', 'b');
    assert.strictEqual(dsu.find(dsu.root('a')), 'a');
    assert.strictEqual(dsu.find(dsu.root('b')), 'a');
    assert.strictEqual(dsu.find(10), undefined);
  });
});