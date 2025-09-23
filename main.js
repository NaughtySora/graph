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

  update(prev, value) {
    const vertex = this.#vertices.get(prev);
    if (vertex === undefined) return false;
    Object.assign(vertex, { value });
    this.#vertices.set(value, vertex);
    this.#vertices.delete(prev);
    return true;
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
    if (vFrom === undefined) return this;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return this;
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

  disconnect(from, to) {
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return false;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return false;
    if (vFrom?.out !== undefined) {
      vFrom.out.delete(vTo);
    }
    if (this.directed && vTo?.in !== undefined) {
      vTo.in.delete(vFrom);
    }
    if (this.weighted && vFrom?.weights !== undefined) {
      vFrom.weights.delete(vTo);
    }
    return true;
  }

  #getEdges(from, direction) {
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined || vFrom[direction] === undefined) {
      return [];
    }
    const vertices = [];
    for (const vertex of vFrom[direction]) {
      vertices.push(vertex.value);
    }
    return vertices;
  }

  getOutEdges(from) {
    return this.#getEdges(from, 'out');
  }

  getInEdges(from) {
    const direction = this.directed ? 'in' : 'out';
    return this.#getEdges(from, direction);
  }

  #hasEdge(from, to, direction) {
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return false;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return false;
    if (vFrom?.[direction] === undefined) return false;
    return vFrom[direction].has(vTo);
  }

  hasOutEdge(from, to) {
    return this.#hasEdge(from, to, 'out');
  }

  hasInEdge(from, to) {
    const direction = this.directed ? 'in' : 'out';
    return this.#hasEdge(from, to, direction);
  }

  getWeight(from, to) {
    if (!this.weighted) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return;
    return vFrom?.weights?.get(vTo);
  }

  setWeight(from, to, weight) {
    if (!this.weighted) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return;
    const weights = vFrom.weights ??= new Map();
    weights.set(vTo, weight);
  }

  deleteWeight(from, to, weight) {
    if (!this.weighted) return false;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return false;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return false;
    if (vFrom.weights === undefined) return false;
    return vFrom.weights.delete(vTo, weight);
  }

  hasWeight(from, to) {
    if (!this.weighted) return false;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return false;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return false;
    if (vFrom.weights === undefined) return false;
    return vFrom.weights.has(vTo);
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

  dfs(vertex = this.#vertices.values().next().value, visited = new Set()) {
    if (!vertex) return visited;
    visited.add(vertex.value);
    if (vertex.out === undefined) return visited;
    for (const link of vertex.out) {
      if (!visited.has(link)) this.dfs(link, visited);
    }
    return visited;
  }

  bfs() {
    const vertex = this.#vertices.values().next().value;
    const visited = new Set();
    if (vertex === undefined) return visited;
    let queue = [vertex];
    visited.add(vertex.value);
    for (let i = 0; i < queue.length; i++) {
      const vertex = queue[i];
      if (vertex.out === undefined) continue;
      for (const connection of vertex.out) {
        if (!visited.has(connection)) {
          visited.add(connection.value);
          queue.push(connection);
        }
      }
    }
    queue = null;
    return visited;
  }
}

module.exports = Graph;
