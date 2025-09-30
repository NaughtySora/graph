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
    const rU = this.root(u);
    const rV = this.root(v);
    if (rU === rV) return this;
    const size = this.#size;
    const min = size[rU] <= size[rV] ? rV : rU;
    const max = min === rU ? rV : rU;
    this.#unions[min] = max;
    this.#size[max] += size[min];
    return this;
  }

  root(value) {
    const index = this.#mapper.get(value);
    if (index === undefined) return -1;
    const parent = this.#unions[index];
    let root = parent;
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