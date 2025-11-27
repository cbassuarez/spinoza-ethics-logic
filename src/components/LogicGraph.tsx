import { useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
import { zoom, zoomIdentity, zoomTransform, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const innerRef = useRef<SVGGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 640 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<{ source: GraphNode; target: GraphNode }[]>([]);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomReadyKey, setZoomReadyKey] = useState(0);

  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const initialTransformRef = useRef<ZoomTransform | null>(null);
  const zoomInitializedRef = useRef(false);
  const fitScaleRef = useRef(1);
  const lastDimensionsRef = useRef<{ width: number; height: number } | null>(null);
  const isOneFingerZoomRef = useRef(false);
  const lastTapTimeRef = useRef<number | null>(null);
  const lastTapPosRef = useRef<{ x: number; y: number } | null>(null);
  const initialTouchYRef = useRef(0);
  const initialZoomKRef = useRef(1);
  const oneFingerPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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

  useEffect(() => {
    if (!svgRef.current || !innerRef.current) return;
    if (!nodes.length) return;
    const positioned = nodes.every((n) => typeof n.x === 'number' && typeof n.y === 'number');
    if (!positioned) return;

    const dimensionsChanged =
      !lastDimensionsRef.current ||
      lastDimensionsRef.current.width !== dimensions.width ||
      lastDimensionsRef.current.height !== dimensions.height;

    if (zoomInitializedRef.current && !dimensionsChanged) return;

    lastDimensionsRef.current = { width: dimensions.width, height: dimensions.height };

    const xValues = nodes.map((n) => n.x ?? 0);
    const yValues = nodes.map((n) => n.y ?? 0);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const dx = Math.max(xMax - xMin, 1);
    const dy = Math.max(yMax - yMin, 1);
    const paddingFactor = 0.4;
    const xPadding = dx * paddingFactor;
    const yPadding = dy * paddingFactor;
    const paddedWidth = dx + xPadding * 2;
    const paddedHeight = dy + yPadding * 2;
    const { width, height } = svgRef.current.getBoundingClientRect();
    const kFit = Math.max(Math.min(width / paddedWidth, height / paddedHeight), 0.01);
    fitScaleRef.current = kFit;
    const kMin = kFit * 0.5;
    const kMax = kFit * 8;
    const cx = xMin + dx / 2;
    const cy = yMin + dy / 2;
    const initial = zoomIdentity.translate(width / 2 - cx * kFit, height / 2 - cy * kFit).scale(kFit);

    const translateExtent: [[number, number], [number, number]] = [
      [xMin - xPadding, yMin - yPadding],
      [xMax + xPadding, yMax + yPadding],
    ];

    const handleZoom = (event: { transform: ZoomTransform }) => {
      select(innerRef.current).attr('transform', event.transform.toString());
      const fit = fitScaleRef.current || 1;
      // Map k = fitScale to 75%
      const percent = (event.transform.k / fit) * 200;
      setZoomPercent(Math.round(percent));
    };

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([kMin, kMax])
      .translateExtent(translateExtent)
      .filter((event) => {
        const e = event as any;
        if (e.type === 'wheel') return true;
        if (e.type === 'mousedown') return e.button === 0;
        if (e.type === 'touchstart') return true;
        return !e.ctrlKey && !e.metaKey && !e.shiftKey;
      })
      .on('zoom', handleZoom);

    zoomBehaviorRef.current = zoomBehavior;
    initialTransformRef.current = initial;
    zoomInitializedRef.current = true;
    setZoomReadyKey((key) => key + 1);

    const svg = select(svgRef.current);
    svg.on('.zoom', null);
    svg.call(zoomBehavior as any);
    svg.call(zoomBehavior.transform as any, initial);
    // Initial view should read 100%
    setZoomPercent(100);
  }, [dimensions.height, dimensions.width, nodes]);

  useEffect(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const svgEl = svgRef.current;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        isOneFingerZoomRef.current = false;
        return;
      }

      const touch = event.touches[0];
      const now = Date.now();
      const lastTime = lastTapTimeRef.current ?? 0;
      const lastPos = lastTapPosRef.current;
      const distance = lastPos ? Math.hypot(touch.clientX - lastPos.x, touch.clientY - lastPos.y) : Infinity;

      if (now - lastTime < 300 && distance < 30) {
        isOneFingerZoomRef.current = true;
        initialTouchYRef.current = touch.clientY;
        initialZoomKRef.current = zoomTransform(svgEl).k;
        const rect = svgEl.getBoundingClientRect();
        oneFingerPointRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      }

      lastTapTimeRef.current = now;
      lastTapPosRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isOneFingerZoomRef.current || !zoomBehaviorRef.current) return;
      if (event.touches.length !== 1) return;
      event.preventDefault();
      const touch = event.touches[0];
      const deltaY = touch.clientY - initialTouchYRef.current;
      const factor = Math.exp(-deltaY * 0.005);
      const [kMin, kMax] = zoomBehaviorRef.current.scaleExtent();
      const nextK = Math.min(Math.max(initialZoomKRef.current * factor, kMin), kMax);
      const point: [number, number] = [oneFingerPointRef.current.x, oneFingerPointRef.current.y];
      select(svgEl).call(zoomBehaviorRef.current.scaleTo as any, nextK, point);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        isOneFingerZoomRef.current = false;
      }
    };

    svgEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    svgEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    svgEl.addEventListener('touchend', handleTouchEnd);
    svgEl.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      svgEl.removeEventListener('touchstart', handleTouchStart);
      svgEl.removeEventListener('touchmove', handleTouchMove);
      svgEl.removeEventListener('touchend', handleTouchEnd);
      svgEl.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [zoomReadyKey]);

  const viewBox = `0 0 ${dimensions.width} ${dimensions.height}`;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(event) => {
        if (!zoomBehaviorRef.current || !svgRef.current) return;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', '=', '0', 'c', 'C'].includes(event.key)) {
          return;
        }
        event.preventDefault();
        const svg = select(svgRef.current);
        const current = zoomTransform(svgRef.current);
        let next = current;
        const step = 40;
        if (event.key === 'ArrowUp') {
          next = zoomIdentity.translate(current.x, current.y + step).scale(current.k);
        } else if (event.key === 'ArrowDown') {
          next = zoomIdentity.translate(current.x, current.y - step).scale(current.k);
        } else if (event.key === 'ArrowLeft') {
          next = zoomIdentity.translate(current.x + step, current.y).scale(current.k);
        } else if (event.key === 'ArrowRight') {
          next = zoomIdentity.translate(current.x - step, current.y).scale(current.k);
        } else if (event.key === '+' || event.key === '=') {
          svg.transition().duration(150).call(zoomBehaviorRef.current.scaleBy as any, 1.2);
          return;
        } else if (event.key === '-') {
          svg.transition().duration(150).call(zoomBehaviorRef.current.scaleBy as any, 1 / 1.2);
          return;
        } else if (event.key === '0' || event.key.toLowerCase() === 'c') {
          const target = initialTransformRef.current;
          if (!target) return;
          svg.transition().duration(250).call(zoomBehaviorRef.current.transform as any, target);
          return;
        }
        svg.transition().duration(150).call(zoomBehaviorRef.current.transform as any, next);
      }}
      className="relative w-full overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--panel)]/60 touch-none focus:outline-none"
    >
      <svg ref={svgRef} width="100%" height={dimensions.height} viewBox={viewBox} role="presentation" className="touch-none">
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <g ref={innerRef} className="graph-inner">
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
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]/20" />
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/80 px-3 py-1 text-xs font-mono text-[var(--text-muted)] shadow-sm">
        {zoomPercent}%
      </div>
    </div>
  );
};

export default LogicGraph;
