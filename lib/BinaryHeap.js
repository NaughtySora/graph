'use strict';

const CHILDREN_OFFSET = 2;

class BinaryHeap {
  #tree = [];
  #compare = null;

  constructor(compare) {
    if (typeof compare !== "function") {
      throw new Error("Binary heap requires a compare function");
    }
    this.#compare = compare;
  }

  #toLeft(index) {
    if (index == 0) return;
    const parent = Math.floor((index - 1) / CHILDREN_OFFSET);
    const tree = this.#tree;
    if (this.#compare(tree[index], tree[parent]) < 0) {
      [tree[parent], tree[index]] = [tree[index], tree[parent]];
      this.#toLeft(parent);
    }
  }

  #toRight(index) {
    const left = (index * CHILDREN_OFFSET) + 1;
    const tree = this.#tree;
    if (left >= tree.length) return;
    const right = left + 1;
    const vLeft = tree[left];
    const vRight = tree[right] ?? vLeft;
    const child = this.#compare(vLeft, vRight) < 0 ? vLeft : vRight;
    if (this.#compare(tree[index], child) > 0) {
      const i = child === vLeft ? left : right;
      [[tree[index]], [tree[i]]] = [[tree[i]], [tree[index]]];
      this.#toRight(i);
    }
  }

  push(value) {
    const index = this.#tree.length;
    this.#tree.push(value);
    this.#toLeft(index);
  }

  shift() {
    const tree = this.#tree;
    const { length } = tree;
    if (length === 0) return;
    const last = length - 1;
    if (last === 0) return tree.pop();
    [tree[0], tree[last]] = [tree[last], tree[0]];
    const first = tree.pop();
    this.#toRight(0);
    return first;
  }

  peek() {
    return this.#tree[0];
  }

  heapify(list) {
    const tree = this.#tree = this.#tree.concat(list);
    let i = Math.floor((tree.length - CHILDREN_OFFSET) / CHILDREN_OFFSET);
    while (i >= 0) this.#toRight(i--);
  }

  copy() {
    return [...this.#tree];
  }

  clear() {
    this.#tree.length = 0;
  }

  get length() {
    return this.#tree.length;
  }
}

module.exports = BinaryHeap;
