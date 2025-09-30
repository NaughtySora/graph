'use strict';

class DSU {
  #collection = [];
  #map = new Map();

  add(v) {
    if (this.#map.has(v)) return this;
    const index = this.#collection.length;
    this.#map.set(v, index);
    this.#collection.push(index);
    return this;
  }

  union(destination, target) {
    const distIndex = this.#map.get(destination);
    if (distIndex === undefined) return;
    const targetIndex = this.#map.get(target);
    if (targetIndex === undefined) return;
    this.#collection[distIndex] = targetIndex;
  }

  root(value) {
    const index = this.#map.get(value);
    if (index === undefined) return -1;
    const parent = this.#collection[index];
    let root = parent;
    while (true) {
      const next = this.#collection[root];
      if (next === root) {
        if (next !== parent) this.#collection[index] = next;
        break;
      }
      root = next;
    }
    return root;
  }

  find(index){
    
  }

  connected(v, u) {

  }

  unionSize(v) {

  }

  debug() {
    console.log({
      map: this.#map,
      collection: this.#collection,
    });
  }

}

module.exports = DSU;