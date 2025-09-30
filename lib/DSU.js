'use strict';

class DSU {
  #collection = [];
  #map = new Map();
  add(v) {
    if (this.#map.has(v)) return this;
    this.#map.set(v, this.#collection.length);
  }
}

module.exports = DSU;