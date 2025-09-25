'use strict';

class Graph {
  #weighted = false;
  #directed = false;
  #vertices = new Map();

  constructor({ weighted = false, directed = false, selfCycling = false } = {}) {
    this.#weighted = weighted;
    this.#directed = directed;
    this.selfCycling = selfCycling;
  }

  get #direction() {
    return this.#directed ? "in" : "out";
  }

  add(value) {
    this.#direction;
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
    const weighted = this.#weighted;
    const directed = this.#directed;
    for (const vertex of this.#vertices.values()) {
      if (vertex?.out !== undefined) vertex.out.delete(vertex);
      if (directed && vertex?.in !== undefined) vertex.in.delete(vertex);
      if (weighted && vertex?.weights !== undefined) vertex.weights.delete(vertex);
    }
    return this.#vertices.delete(value);
  }

  connect(from, to, weight) {
    if (from === to && !this.selfCycling) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return this;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return this;
    vFrom.out ??= new Set();
    vFrom.out.add(vTo);
    vTo[this.#direction] ??= new Set();
    vTo[this.#direction].add(vFrom);
    if (this.#weighted && weight !== undefined) {
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
    if (vFrom.out !== undefined) {
      vFrom.out.delete(vTo);
    }
    if (vTo[this.#direction] !== undefined) {
      vTo[this.#direction].delete(vFrom);
    }
    if (this.#weighted && vFrom.weights !== undefined) {
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
    return [...vertices];
  }

  getOutEdges(from) {
    return this.#getEdges(from, 'out');
  }

  getInEdges(from) {
    return this.#getEdges(from, this.#direction);
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
    return this.#hasEdge(from, to, this.#direction);
  }

  getWeight(from, to) {
    if (!this.#weighted) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return;
    return vFrom?.weights?.get(vTo);
  }

  setWeight(from, to, weight) {
    if (!this.#weighted) return;
    if (from === to && !this.selfCycling) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return;
    const weights = vFrom.weights ??= new Map();
    weights.set(vTo, weight);
  }

  deleteWeight(from, to, weight) {
    if (!this.#weighted) return false;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return false;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return false;
    if (vFrom.weights === undefined) return false;
    return vFrom.weights.delete(vTo, weight);
  }

  hasWeight(from, to) {
    if (!this.#weighted) return false;
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
    const visited = new Set();
    for (const entries of this.#vertices.entries()) {
      const value = entries[1].value;
      if (visited.has(value)) continue;
      const list = entries[1]?.out;
      if (list === undefined) continue;
      for (const link of list) {
        visited.add(link.value);
        yield [value, link.value];
      }
    }
  }

  degree(value) {
    const vertex = this.#vertices.get(value);
    if (vertex === undefined || vertex.out === undefined) return 0;
    return vertex.out.size;
  }

  connectivity(value) {
    if (!this.#directed) return this.degree(value);
    const vertex = this.#vertices.get(value);
    if (vertex === undefined || vertex.in === undefined) return 0;
    return vertex.in.size;
  }

  dfs(vertex = this.#vertices.values().next().value, visited = new Set()) {
    if (!vertex) return visited;
    visited.add(vertex.value);
    if (vertex.out === undefined) return visited;
    for (const link of vertex.out) {
      if (!visited.has(link.value)) this.dfs(link, visited);
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
      for (const link of vertex.out) {
        if (!visited.has(link.value)) {
          visited.add(link.value);
          queue.push(link);
        }
      }
    }
    queue = null;
    return visited;
  }

  wcc() {
    const groups = [];
    const visited = new Set();
    const dfs = (vertex, group) => {
      visited.add(vertex);
      group.push(vertex.value);
      if (vertex.out === undefined) return;
      for (const link of vertex.out) {
        if (!visited.has(link)) dfs(link, group);
      }
    };
    for (const vertex of this.#vertices.values()) {
      if (visited.has(vertex)) continue;
      const group = [];
      dfs(vertex, group);
      if (group.length > 0) groups.push(group);
    }
    return groups;
  }

  scc() {
    if (!this.#directed) return this.wcc();
    const stack = [];
    const visited = new Set();
    const dfs = (vertex, direction, stack) => {
      visited.add(vertex);
      if (vertex[direction] !== undefined) {
        for (const link of vertex[direction]) {
          if (!visited.has(link)) {
            dfs(link, direction, stack);
          }
        }
      }
      stack.push(vertex);
    };
    for (const vertex of this.#vertices.values()) {
      if (visited.has(vertex)) continue;
      dfs(vertex, 'out', stack);
    }
    visited.clear();
    const groups = [];
    while (stack.length > 0) {
      const group = [];
      const vertex = stack.pop();
      if (visited.has(vertex)) continue;
      dfs(vertex, 'in', group);
      if (group.length > 0) {
        groups.push(group.map(vertex => vertex.value));
      }
    }
    return groups;
  }

  hasCycles() {
    if (!this.#directed && this.#vertices.size > 0) {
      for (const v of this.#vertices.values()) {
        if (v.out === undefined) continue;
        if (v.out.size > 0) return true;
      }
      return false;
    }
    const visited = new Set();
    const active = new Set();
    const detectCycle = vertex => {
      visited.add(vertex);
      active.add(vertex);
      if (vertex.out === undefined) return false;
      for (const link of vertex.out) {
        if (!visited.has(link)) {
          if (detectCycle(link)) return true;
        } else if (active.has(link)) return true;
      }
      active.delete(vertex);
      return false;
    };
    for (const vertex of this.#vertices.values()) {
      if (visited.has(vertex)) continue;
      if (detectCycle(vertex)) return true;
    }
    return false;
  }

  topologicalSort() {
    if (this.hasCycles()) return [];
    const visited = new Set();
    const stack = [];
    const dfs = (vertex) => {
      visited.add(vertex);
      if (vertex.out !== undefined) {
        for (const link of vertex.out) {
          if (visited.has(link)) continue;
          dfs(link);
        }
      }
      stack.push(vertex.value);
    };
    for (const vertex of this.#vertices.values()) {
      if (visited.has(vertex)) continue;
      dfs(vertex);
    }
    return stack.reverse();
  }

  #pathOne(vertex, to) {
    if (this.#vertices.get(to) === undefined) return [];
    const queue = [vertex];
    const visited = new Set();
    visited.add(vertex.value);
    const edges = new Map();
    for (let i = 0; i < queue.length; i++) {
      const vertex = queue[i];
      if (vertex.out === undefined) continue;
      for (const link of vertex.out) {
        if (visited.has(link.value)) continue;
        visited.add(link.value);
        edges.set(link.value, vertex.value);
        queue.push(link);
        if (edges.has(to)) break;
      }
    }
    let edge = to;
    const path = [];
    while (edge !== undefined) {
      path[path.length] = edge;
      edge = edges.get(edge);
    }
    return path.reverse();
  }

  shortPath(from, to) {
    const vertex = this.#vertices.get(from);
    if (vertex === undefined) return [];
    if (to !== undefined) return this.#pathOne(vertex, to);
  }
}

module.exports = Graph;
