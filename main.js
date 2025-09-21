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
    if (vFrom === undefined || vTo === undefined) return this;
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
    return this;
  }

  #getEdges(from, direction) {
    const vertex = this.#vertices.get(from);
    if (vertex === undefined || vertex[direction] === undefined) {
      return null;
    }
    return [...vertex[direction]];
  }

  getOutEdges(from) {
    return this.#getEdges(from, 'out');
  }

  getInEdges(from) {
    const direction = this.directed ? 'in' : 'out';
    return this.#getEdges(from, direction);
  }

  #hasEdges(from, to, direction) {
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return false;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return false;
    return vFrom?.[direction]?.has(vTo);
  }

  hasOutEdges(from, to) {
    return this.#hasEdges(from, to, 'out');
  }

  hasInEdges(from, to) {
    const direction = this.directed ? 'in' : 'out';
    return this.#hasEdges(from, to, direction);
  }

  delete(value) {
    const target = this.#vertices.get(value);
    if (target === undefined) return false;
    for (const v of this.#vertices.values()) {
      v?.out?.delete(target);
      if (this.directed) v?.in?.delete(target);
      if (this.weighted) v?.weights?.delete(target);
    }
    return this.#vertices.delete(value);
  }

  getWeight(from, to) {
    if (!this.weighted) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return;
    return vFrom?.weights?.get(vTo);
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

module.exports = Graph;
