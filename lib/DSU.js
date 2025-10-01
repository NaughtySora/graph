'use strict';

class DSU {
  #unions = [];
  #size = [];
  #mapper = new Map();
  #cache = null;

  add(v) {
    if (this.#mapper.has(v)) return this;
    const index = this.#unions.length;
    this.#mapper.set(v, index);
    this.#unions.push(index);
    this.#size[index] = 1;
    return this;
  }

  union(u, v) {
    let rU = this.root(u);
    let rV = this.root(v);
    if (rU === rV) return this;
    const size = this.#size;
    if (size[rU] < size[rV]) [rU, rV] = [rV, rU];
    this.#unions[rV] = rU;
    this.#size[rU] += size[rV];
    return this;
  }

  root(value) {
    const index = this.#mapper.get(value);
    if (index === undefined) return -1;
    const parent = this.#unions[index];
    let root = index;
    while (true) {
      const next = this.#unions[root];
      if (next === root) {
        if (next !== parent) this.#unions[index] = next;
        break;
      }
      root = next;
    }
    return root;
  }

  find(index) {
    const cache = this.#cache ??= new Map();
    const value = cache.get(index);
    if (value !== undefined) return value;
    for (const entry of this.#mapper) {
      if (entry[1] === index) {
        const value = entry[0];
        cache.set(index, value);
        return value;
      }
    }
  }

  connected(v, u) {
    return this.root(v) === this.root(u);
  }

  size(v) {
    return this.#size[this.root(v)];
  }
}

module.exports = DSU;