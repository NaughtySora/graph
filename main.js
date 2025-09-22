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

  has(value) {
    return this.#vertices.has(value);
  }

  delete(value) {
    const vertex = this.#vertices.get(value);
    if (vertex === undefined) return false;
    const { directed, weighted } = this;
    for (const vertex of this.#vertices.values()) {
      if (vertex?.out !== undefined) vertex.out.delete(vertex);
      if (directed && vertex?.in !== undefined) vertex.in.delete(vertex);
      if (weighted && vertex?.weights !== undefined) vertex.weights.delete(vertex);
    }
    return this.#vertices.delete(value);
  }

  connect(from, to, weight) {
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

  disconnect() {

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

  deleteEdge() {

  }

  getWeight(from, to) {
    if (!this.weighted) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return;
    return vFrom?.weights?.get(vTo);
  }

  *vertices() {
    const vertices = this.#vertices.values();
    while (true) {
      const next = vertices.next();
      if (next.done) return;
      yield { value: next.value.value };
    }
  }

  *edges() {
    for (const entries of this.#vertices.entries()) {
      const list = entries[1]?.out;
      if (list === undefined) continue;
      for (const link of list) {
        yield [entries[1].value, link.value];
      }
    }
  }
}

module.exports = Graph;
