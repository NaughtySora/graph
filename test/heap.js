'use strict';

const { describe, it, beforeEach } = require("node:test");
const BinaryHeap = require("../lib/BinaryHeap.js");
const assert = require("node:assert");

describe('BinaryHeap', () => {
  describe('MaxHeap', () => {
    let heap = new BinaryHeap((a, b) => b - a);
    beforeEach(() => {
      heap = new BinaryHeap((a, b) => b - a);
    });
    it('push', () => {
      heap.push(1);
      assert.deepStrictEqual(heap.copy(), [1]);
      heap.push(2);
      assert.deepStrictEqual(heap.copy(), [2, 1]);
      heap.push(0);
      assert.deepStrictEqual(heap.copy(), [2, 1, 0]);
      heap.push(3);
      assert.deepStrictEqual(heap.copy(), [3, 2, 0, 1]);
    });
    it('peek', () => {
      heap.push(1);
      assert.strictEqual(heap.peek(), 1);
      assert.strictEqual(heap.length, 1);
      heap.push(2);
      assert.strictEqual(heap.peek(), 2);
      assert.strictEqual(heap.length, 2);
    });
    it('shift', () => {
      heap.push(5);
      heap.push(2);
      heap.push(5);
      heap.push(4);
      heap.push(6);
      assert.strictEqual(heap.shift(), 6);
      assert.deepStrictEqual(heap.copy(), [5, 4, 5, 2]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [5, 4, 2]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [4, 2]);
      assert.strictEqual(heap.shift(), 4);
      assert.deepStrictEqual(heap.copy(), [2]);
      assert.strictEqual(heap.shift(), 2);
      assert.deepStrictEqual(heap.copy(), []);
    });
    it('heapify', () => {
      heap.heapify([5, 2, 5, 4, 6]);
      assert.deepStrictEqual(heap.copy(), [6, 5, 5, 4, 2]);
      assert.strictEqual(heap.shift(), 6);
      assert.deepStrictEqual(heap.copy(), [5, 4, 5, 2]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [5, 4, 2]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [4, 2]);
      assert.strictEqual(heap.shift(), 4);
      assert.deepStrictEqual(heap.copy(), [2]);
      assert.strictEqual(heap.shift(), 2);
      assert.deepStrictEqual(heap.copy(), []);
    });
  });

  describe('MinHeap', () => {
    let heap = new BinaryHeap((a, b) => a - b);
    beforeEach(() => {
      heap = new BinaryHeap((a, b) => a - b);
    });
    it('push', () => {
      heap.push(1);
      assert.deepStrictEqual(heap.copy(), [1]);
      heap.push(2);
      assert.deepStrictEqual(heap.copy(), [1, 2]);
      heap.push(0);
      assert.deepStrictEqual(heap.copy(), [0, 2, 1]);
      heap.push(3);
      assert.deepStrictEqual(heap.copy(), [0, 2, 1, 3]);
    });
    it('peek', () => {
      heap.push(1);
      assert.strictEqual(heap.peek(), 1);
      assert.strictEqual(heap.length, 1);
      heap.push(2);
      assert.strictEqual(heap.peek(), 1);
      assert.strictEqual(heap.length, 2);
    });
    it('shift', () => {
      heap.push(5);
      heap.push(2);
      heap.push(5);
      heap.push(4);
      heap.push(6);
      assert.strictEqual(heap.shift(), 2);
      assert.deepStrictEqual(heap.copy(), [4, 5, 5, 6]);
      assert.strictEqual(heap.shift(), 4);
      assert.deepStrictEqual(heap.copy(), [5, 6, 5]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [5, 6]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [6]);
      assert.strictEqual(heap.shift(), 6);
      assert.deepStrictEqual(heap.copy(), []);
    });
    it('heapify', () => {
      heap.heapify([5, 2, 5, 4, 6]);
      assert.deepStrictEqual(heap.copy(), [2, 4, 5, 5, 6]);
      assert.strictEqual(heap.shift(), 2);
      assert.deepStrictEqual(heap.copy(), [4, 5, 5, 6]);
      assert.strictEqual(heap.shift(), 4);
      assert.deepStrictEqual(heap.copy(), [5, 6, 5]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [5, 6]);
      assert.strictEqual(heap.shift(), 5);
      assert.deepStrictEqual(heap.copy(), [6]);
      assert.strictEqual(heap.shift(), 6);
      assert.deepStrictEqual(heap.copy(), []);
    });
  });
});