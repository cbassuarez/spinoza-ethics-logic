import { useEffect, useMemo, useRef, useState } from 'react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import type { EthicsItem } from '../data/types';

type GraphNode = {
  id: string;
  kind: EthicsItem['kind'];
  part: EthicsItem['part'];
  label: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

type GraphEdge = {
  source: string;
  target: string;
};

type Props = {
  items: EthicsItem[];
  onSelect: (id: string) => void;
};

const kindStyles: Record<EthicsItem['kind'], { fill: string; stroke: string }> = {
  definition: { fill: 'var(--card-tint)', stroke: 'var(--border)' },
  axiom: { fill: 'var(--card-tint)', stroke: 'var(--border)' },
  postulate: { fill: 'var(--card-tint)', stroke: 'var(--border)' },
  proposition: { fill: 'var(--card-tint)', stroke: 'var(--border)' },
  scholium: { fill: 'var(--card-tint)', stroke: 'var(--border)' },
  corollary: { fill: 'var(--card-tint)', stroke: 'var(--border)' },
  lemma: { fill: 'var(--card-tint)', stroke: 'var(--border)' },
};

const LogicGraph = ({ items, onSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 640 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<{ source: GraphNode; target: GraphNode }[]>([]);

  const graphData = useMemo(() => {
    const graphNodes: GraphNode[] = items.map((item) => ({
      id: item.id,
      kind: item.kind,
      part: item.part,
      label: item.label,
    }));
    const graphEdges: GraphEdge[] = items.flatMap((item) =>
      item.dependencies.uses.map((dep) => ({
        source: item.id,
        target: dep.id,
      })),
    );
    return { graphNodes, graphEdges };
  }, [items]);

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const { width } = el.getBoundingClientRect();
      setDimensions({ width, height: Math.max(420, width * 0.6) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const simulationNodes = graphData.graphNodes.map((n) => ({ ...n }));
    const nodeById = new Map(simulationNodes.map((n) => [n.id, n]));
    const simulationEdges = graphData.graphEdges
      .filter((edge) => nodeById.has(edge.source) && nodeById.has(edge.target))
      .map((edge) => ({
        source: nodeById.get(edge.source)!,
        target: nodeById.get(edge.target)!,
      }));

    const sim = forceSimulation(simulationNodes as GraphNode[])
      .force('charge', forceManyBody().strength(-120))
      .force('center', forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('link', forceLink(simulationEdges).distance(110).strength(0.6))
      .force('collide', forceCollide(24))
      .alphaDecay(0.05);

    const ticked = () => {
      setNodes([...simulationNodes]);
      setEdges(simulationEdges as { source: GraphNode; target: GraphNode }[]);
    };

    sim.on('tick', ticked);
    return () => sim.stop();
  }, [graphData, dimensions.height, dimensions.width]);

  const neighbors = useMemo(() => {
    const adj = new Map<string, Set<string>>();
    edges.forEach((edge) => {
      adj.set(edge.source.id, adj.get(edge.source.id) || new Set());
      adj.set(edge.target.id, adj.get(edge.target.id) || new Set());
      adj.get(edge.source.id)!.add(edge.target.id);
      adj.get(edge.target.id)!.add(edge.source.id);
    });
    return adj;
  }, [edges]);

  const isNeighbor = (id: string) => {
    if (!activeId) return false;
    if (id === activeId) return true;
    return neighbors.get(activeId)?.has(id) || false;
  };

  const viewBox = `0 0 ${dimensions.width} ${dimensions.height}`;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--panel)]/60">
      <svg width="100%" height={dimensions.height} viewBox={viewBox} role="presentation">
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <g>
          {edges.map((edge, idx) => (
            <line
              key={`${edge.source.id}-${edge.target.id}-${idx}`}
              x1={edge.source.x}
              y1={edge.source.y}
              x2={edge.target.x}
              y2={edge.target.y}
              stroke="url(#edgeGradient)"
              strokeWidth={isNeighbor(edge.source.id) || isNeighbor(edge.target.id) ? 2 : 1}
              opacity={activeId ? (isNeighbor(edge.source.id) || isNeighbor(edge.target.id) ? 0.85 : 0.2) : 0.5}
            />
          ))}
        </g>
        <g>
          {nodes.map((node) => {
            const active = isNeighbor(node.id);
            const style = kindStyles[node.kind];
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(node.id)}
                onBlur={() => setActiveId(null)}
                onClick={() => onSelect(node.id)}
                tabIndex={0}
                role="button"
                aria-label={`Navigate to ${node.id}`}
                className="cursor-pointer outline-none"
              >
                <circle
                  r={active ? 18 : 14}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={active ? 2 : 1}
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text
                  y={4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={active ? 12 : 11}
                  fill="var(--text)"
                  opacity={active ? 1 : 0.8}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]/20" />
    </div>
  );
};

export default LogicGraph;
