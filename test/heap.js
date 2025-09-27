'use strict';

const { describe, it } = require("node:test");
const BinaryHeap = require("../lib/BinaryHeap.js");

describe.only('BinaryHeap', () => {
  describe('MaxHeap', () => {
    const heap = new BinaryHeap((a, b) => b - a);
  });

  describe('MinHeap', () => {
    it('shift', () => {
      const array = [3, 1, 10, 7, 5];
      const heap = new BinaryHeap((a, b) => a - b);
      heap.heapify(array);
      console.log(heap.copy());
      const one = heap.shift();
      console.log({ one });
      console.log(heap.copy());
    });
  });
});