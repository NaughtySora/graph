'use strict';

class DSU {
  #unions = [];
  #ranks = [];
  #indexes = new Map();
  #cache = null;

  add(value) {
    if (this.#indexes.has(value)) return this;
    const index = this.#unions.length;
    this.#indexes.set(value, index);
    this.#unions.push(index);
    this.#ranks[index] = 1;
    return this;
  }

  union(u, v) {
    let rootU = this.root(u);
    let rootV = this.root(v);
    if (rootU === rootV) return this;
    if (this.#ranks[rootU] < this.#ranks[rootV]) {
      [rootU, rootV] = [rootV, rootU];
    }
    this.#unions[rootV] = rootU;
    this.#ranks[rootU] += this.#ranks[rootV];
    return this;
  }

  root(value) {
    const index = this.#indexes.get(value);
    if (index === undefined) return -1;
    const union = this.#unions[index];
    let pointer = index;
    while (true) {
      const next = this.#unions[pointer];
      if (next === pointer) {
        if (next !== union) this.#unions[index] = next;
        break;
      }
      pointer = next;
    }
    return pointer;
  }

  find(index) {
    const cache = this.#cache ??= new Map();
    const value = cache.get(index);
    if (value !== undefined) return value;
    for (const entry of this.#indexes) {
      if (entry[1] !== index) continue;
      const value = entry[0];
      cache.set(index, value);
      return value;
    }
  }

  connected(v, u) {
    return this.root(v) === this.root(u);
  }

  size(v) {
    return this.#ranks[this.root(v)];
  }
}

module.exports = DSU;