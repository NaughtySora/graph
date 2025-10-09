export class Graph {
  constructor(options?: { weighted?: boolean; directed?: boolean; });
  add(value: any): this;
  update(prev: any, value: any): boolean;
  has(value: any): boolean;
  delete(value: any): boolean;
  connect(from: any, to: any, weight?: any): this;
  disconnect(from: any, to: any): boolean;
  getOutEdges(from: any): any[];
  getInEdges(from: any): any[];
  hasOutEdge(from: any, to: any): boolean;
  hasInEdge(from: any, to: any): boolean;
  getWeight(from: any, to: any): any;
  setWeight(from: any, to: any, weight: any): void;
  deleteWeight(from: any, to: any, weight: any): boolean;
  hasWeight(from: any, to: any): boolean;
  vertices(): Generator<any>;
  edges(): Generator<[any, any]>;
  degree(value: any): number;
  connectivity(value: any): number;
  dfs<V extends any, S extends Set<any>>(vertex?: V, visited?: S): S;
  bfs(): Set<any>;
  wcc(): any[][];
  scc(): any[][];
  hasCycles(): boolean;
  topologicalSort(): any[];
  shortPath(from: any): Map<any, any>;
  shortPath(from: any, to: any): any[];
  shortPathWeighted(options: { from: any, }): { distance: Map<any, number>; path: null; cost: 0; };
  shortPathWeighted(options: { from: any, to: any }): { distance: null; path: any[]; cost: number | undefined; };
  shortPathWeighted(options: { from: any, negativeWeights: true }): { distance: number; path: any[]; cycle: boolean; }[]
  shortPathWeighted(options: { from: any, to: any, negativeWeights: true }): { distance: number; path: any[]; cycle: boolean; };
  totalEdges(): number;
  density(): number;
  isDense(): boolean;
  mst(): Set<any>;
}
