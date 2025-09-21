'use strict';

class Graph {
  weighted = false;
  directed = false;
  #vertices = new Map();

  constructor({ weighted = false, directed = false } = {}) {
    this.weighted = weighted;
    this.directed = directed;
  }

  add(value) {
    if (this.#vertices.has(value)) return this;
    this.#vertices.set(value, { value, });
    return this;
  }

  edge(from, to, weight) {
    const vFrom = this.#vertices.get(from);
    const vTo = this.#vertices.get(to);
    if (vFrom === undefined || vTo === undefined) return;
    vFrom.out ??= new Set();
    vFrom.out.add(vTo);
    if (this.directed) {
      vTo.in ??= new Set();
      vTo.in.add(vFrom);
    }
    if (this.weighted && weight !== undefined) {
      const weights = vFrom.weights ??= new Map();
      weights.set(vTo, weight);
    }
  }

  getWeight(from, to) {
    if (!this.weighted) return;
    const vFrom = this.#vertices.get(from);
    const vTo = this.#vertices.get(to);
    if (vFrom === undefined || vTo === undefined) return;
    return vFrom?.weights?.get(vTo);
  }

  delete(value) {
    const target = this.#vertices.get(value);
    if (target === undefined) return false;
    for (const v of this.#vertices.values()) {
      v?.out.delete(target);
      if (this.directed) v?.in.delete(target);
      if (this.weighted) v?.weights?.delete(target);
    }
    return this.#vertices.delete(value);
  }

  hasEdges(from, to) {
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return false;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return false;
    return vFrom?.out?.has(vTo);
  }

  vertices() {
    return this.#vertices.values();
  }

  edges() {
    const edges = [];
    for (const entries of this.#vertices.entries()) {
      const list = entries[1]?.out;
      if (list === undefined) continue;
      for (const link of list) {
        edges.push([entries[1], link]);
      }
    }
    return edges;
  }
}
