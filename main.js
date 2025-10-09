'use strict';

const BinaryHeap = require("./lib/BinaryHeap.js");
const DSU = require("./lib/DSU.js");

class Graph {
  #weighted = false;
  #directed = false;
  #vertices = new Map();

  constructor({ weighted = false, directed = false } = {}) {
    this.#weighted = weighted;
    this.#directed = directed;
  }

  get #direction() {
    return this.#directed ? "in" : "out";
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
    for (const vertex of this.#vertices.values()) {
      if (vertex.out !== undefined) vertex.out.delete(vertex);
      if (this.#directed && vertex.in !== undefined) {
        vertex.in.delete(vertex);
      }
      if (this.#weighted && vertex.weights !== undefined) {
        vertex.weights.delete(vertex);
      }
    }
    return this.#vertices.delete(value);
  }

  connect(from, to, weight) {
    if (from === to) return this;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return this;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return this;
    vFrom.out ??= new Set();
    vFrom.out.add(vTo);
    vTo[this.#direction] ??= new Set();
    vTo[this.#direction].add(vFrom);
    if (this.#weighted && weight !== undefined) {
      (vFrom.weights ??= new Map()).set(vTo, weight);
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
    return vertices;
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
    if (vFrom[direction] === undefined) return false;
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
    const weight = vFrom?.weights?.get(vTo);
    if (this.#directed) return weight;
    return weight ?? vTo?.weights?.get(vFrom);
  }

  setWeight(from, to, weight) {
    if (!this.#weighted) return;
    if (from === to) return;
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return;
    const vTo = this.#vertices.get(to);
    if (vTo === undefined) return;
    (vFrom.weights ??= new Map()).set(vTo, weight);
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
      const list = entries[1].out;
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
        if (visited.has(link.value)) continue;
        visited.add(link.value);
        queue.push(link);
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
    visited.clear();
    return groups;
  }

  scc() {
    if (!this.#directed) return this.wcc();
    const stack = [];
    const visited = new Set();
    const dfs = (vertex, direction, stack, callback = x => x) => {
      visited.add(vertex);
      if (vertex[direction] !== undefined) {
        for (const link of vertex[direction]) {
          if (visited.has(link)) continue;
          dfs(link, direction, stack, callback);
        }
      }
      stack.push(callback(vertex));
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
      dfs(vertex, 'in', group, vertex => vertex.value);
      if (group.length > 0) groups.push(group);
    }
    visited.clear();
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
        } else {
          if (active.has(link)) return true;
        }
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
    visited.clear();
    return stack.reverse();
  }

  #pathOne(vertex, to) {
    const target = this.#vertices.get(to);
    if (target === undefined) return [];
    let queue = [vertex];
    const visited = new Set();
    visited.add(vertex);
    const edges = new Map();
    for (let i = 0; i < queue.length; i++) {
      const vertex = queue[i];
      if (vertex.out === undefined) continue;
      for (const link of vertex.out) {
        if (visited.has(link)) continue;
        visited.add(link);
        edges.set(link, vertex);
        queue.push(link);
        if (edges.has(target)) break;
      }
    }
    queue = null;
    visited.clear();
    let edge = edges.get(target);
    if (edge === undefined) return (edges.clear(), []);
    const path = [to];
    while (edge !== undefined) {
      path.push(edge.value);
      edge = edges.get(edge);
    }
    edges.clear();
    return path.reverse();
  }

  #pathMany(vertex) {
    let queue = [vertex];
    const visited = new Set();
    visited.add(vertex);
    const edges = new Map();
    for (let i = 0; i < queue.length; i++) {
      const vertex = queue[i];
      if (vertex.out === undefined) continue;
      for (const link of vertex.out) {
        if (visited.has(link)) continue;
        visited.add(link);
        edges.set(link, vertex);
        queue.push(link);
      }
    }
    visited.clear();
    queue = null;
    const paths = new Map();
    for (const edge of edges.keys()) {
      const path = [];
      let pointer = edge;
      while (pointer !== undefined) {
        path.push(pointer.value);
        pointer = edges.get(pointer);
      }
      if (path.length === 1 && path[0] === edge.value) continue;
      paths.set(edge.value, path.reverse());
    }
    edges.clear();
    return paths;
  }

  shortPath(from, to) {
    const vertex = this.#vertices.get(from);
    if (vertex === undefined) return [];
    if (to !== undefined) return this.#pathOne(vertex, to);
    return this.#pathMany(vertex);
  }

  #dijkstraMany(vertex) {
    const dist = new Map([[vertex, 0]]);
    const distance = new Map();
    const visited = new Set();
    const queue = new BinaryHeap((a, b) => a.value - b.value);
    queue.push({ vertex, value: 0 });
    let item = queue.shift();
    while (item !== undefined) {
      const vertex = item.vertex;
      if (!visited.has(vertex)) {
        visited.add(vertex);
        if (vertex.out !== undefined && vertex.weights !== undefined) {
          for (const link of vertex.out) {
            const weight = vertex.weights.get(link);
            if (weight === undefined) continue;
            const current = dist.get(link) ?? Infinity;
            const min = Math.min(current, dist.get(vertex) + weight);
            if (current > min) {
              dist.set(link, min);
              distance.set(link.value, min);
              queue.push({ vertex: link, value: min });
            }
          }
        }
      }
      item = queue.shift();
    }
    queue.clear();
    visited.clear();
    return {
      distance,
      path: null,
      cost: -1,
    };
  }

  #dijkstraOne(from, to) {
    const dist = new Map([[from, 0]]);
    const parent = new Map();
    const visited = new Set();
    const queue = new BinaryHeap((a, b) => a.value - b.value);
    queue.push({ vertex: from, value: 0 });
    let item = queue.shift();
    while (item !== undefined) {
      const vertex = item.vertex;
      if (!visited.has(vertex)) {
        visited.add(vertex);
        if (vertex.out !== undefined && vertex.weights !== undefined) {
          for (const link of vertex.out) {
            const weight = vertex.weights.get(link);
            if (weight === undefined) continue;
            const current = dist.get(link) ?? Infinity;
            const min = Math.min(current, dist.get(vertex) + weight);
            if (current > min) {
              dist.set(link, min);
              parent.set(link.value, vertex.value);
              queue.push({ vertex: link, value: min });
            }
          }
        }
      }
      item = queue.shift();
    }
    queue.clear();
    visited.clear();
    const path = [to.value];
    let target = to.value;
    for (; ;) {
      const next = parent.get(target);
      if (next === undefined) break;
      path.push(next);
      target = next;
    }
    parent.clear();
    return {
      distance: null,
      path: path.reverse(),
      cost: dist.get(to)
    };
  }

  #bellmanFord(from) {
    const paths = new Map();
    const dist = new Map([[from, 0]]);
    let totalVertices = this.#vertices.size - 1;
    let touched = false;
    while (totalVertices-- > 0) {
      touched = false;
      for (const vertex of this.#vertices.values()) {
        const cost = dist.get(vertex.value) ?? Infinity;
        if (vertex.out !== undefined && vertex.weights !== undefined) {
          for (const link of vertex.out) {
            const distCost = dist.get(link.value) ?? Infinity;
            const weight = vertex.weights.get(link) ?? 0;
            const min = Math.min(distCost, cost + weight);
            if (min !== distCost) {
              touched = true;
              dist.set(link.value, min);
              paths.set(link.value, vertex.value);
            }
          }
        }
      }
      if (!touched) break;
    }
    return { dist, paths };
  }

  shortPathWeighted({ from, to, negativeWeights = false } = {}) {
    const vFrom = this.#vertices.get(from);
    if (vFrom === undefined) return null;
    const vTo = this.#vertices.get(to);
    if (negativeWeights) {
      const { dist, paths } = this.#bellmanFord(from);
      const findPath = target => {
        const path = [target];
        let pointer = target;
        let max = paths.size + 1;
        while (pointer !== undefined) {
          if (--max === -1) break;
          const next = paths.get(pointer);
          if (next) path.push(next);
          pointer = next;
        }
        return {
          distance: dist.get(target) ?? Infinity,
          path: path.reverse(),
          cycle: max === -1,
        };
      };
      if (vTo !== undefined) return findPath(to);
      const dataset = [];
      for (const vertex of this.#vertices.values()) {
        if (vertex === vFrom) continue;
        dataset.push(findPath(vertex.value));
      }
      return dataset;
    } else {
      if (vTo !== undefined) return this.#dijkstraOne(vFrom, vTo);
      return this.#dijkstraMany(vFrom);
    }
  }

  totalEdges() {
    if (this.#vertices.size === 0) return 0;
    const mapper = new Map();
    const unique = new Set();
    for (const vertex of this.#vertices.values()) {
      mapper.set(vertex, mapper.size);
    }
    for (const vertex of this.#vertices.values()) {
      const i = mapper.get(vertex);
      if (vertex.out === undefined) continue;
      for (const link of vertex.out) {
        const keys = [i, mapper.get(link)];
        if (!this.#directed) keys.sort();
        unique.add(`${keys[0]}${keys[1]}`);
      }
    }
    return unique.size;
  }

  density() {
    const size = this.#vertices.size;
    if (size === 0) return 0;
    const max = (size * (size - 1)) / 2;
    const edges = this.totalEdges();
    return (this.#directed ? edges / 2 : edges) / max;
  }

  isDense() {
    if (this.#vertices.size === 0) return false;
    return this.density() > Graph.DENSITY_FACTOR;
  }

  #kruskal() {
    const edges = [];
    for (const vertex of this.#vertices.values()) {
      if (vertex.out === undefined || vertex.weights === undefined) continue;
      for (const link of vertex.out) {
        const weight = vertex.weights.get(link);
        if (weight === undefined) continue;
        edges.push({ vertex, link, weight });
      }
    }
    edges.sort((a, b) => a.weight - b.weight);
    const dsu = new DSU();
    const mst = new Set();
    for (const { vertex, link } of edges) {
      dsu.add(vertex).add(link);
      if (dsu.connected(vertex, link)) continue;
      mst.add(vertex.value);
      mst.add(link.value);
      dsu.union(vertex, link);
    }
    return mst;
  }
  //test prim and kruskal
  #prim() {
    const mst = new Set();
    const iter = this.#vertices.values();
    let from = iter.next().value;
    while (from.out === undefined || from.weights === undefined) {
      const next = iter.next();
      if (next.done) return mst;
      from = next.value;
    }
    const heap = new BinaryHeap((a, b) => a.weight - b.weight);
    for (const to of from.out) {
      const weight = from.weights.get(to);
      if (weight === undefined) continue;
      heap.push({ from, to, weight });
    }
    const visited = new Set();
    visited.add(from);
    while (visited.size < this.#vertices.size) {
      const edge = heap.shift();
      if (edge === undefined) break;
      const { from, to } = edge;
      if (visited.has(to)) continue;
      visited.add(to);
      mst.add(from.value);
      mst.add(to.value);
      if (to.out === undefined || to.weights === undefined) continue;
      for (const neighbor of to.out) {
        if (visited.has(neighbor)) continue;
        const weight = to.weights.get(neighbor);
        if (weight == undefined) continue;
        heap.push({ from: to, to: neighbor, weight });
      }
    }
    return mst;
  }

  mst() {
    return this.isDense() ? this.#prim() : this.#kruskal();
  }

  static DENSITY_FACTOR = 0.8;
}

module.exports = Graph;

