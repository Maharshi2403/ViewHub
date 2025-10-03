import * as d3 from 'd3';

export interface TreeNode {
  name: string;
  value?: any;
  children?: TreeNode[];
}

export interface HierarchyNode extends d3.HierarchyNode<TreeNode> {
  x: number;
  y: number;
}

export interface HierarchyLink extends d3.HierarchyLink<TreeNode> {
  source: HierarchyNode;
  target: HierarchyNode;
}

export function createTreeData(jsonData: any): TreeNode | null {
  try {
    if (!jsonData) return null;
    if (typeof jsonData === 'string' && (jsonData.startsWith('Error:') || jsonData.includes('Error occurred while'))) {
      return null;
    }

    let data: any;
    try {
      data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    } catch {
      return null;
    }

    const root: TreeNode = { name: 'API Response', children: [] };

    const processObject = (obj: any): TreeNode[] => {
      if (Array.isArray(obj)) {
        return obj.map((item, index): TreeNode => {
          if (item && typeof item === 'object') {
            return { name: `[${index}]`, children: processObject(item) };
          }
          return { name: `[${index}]`, value: String(item) };
        });
      }
      return Object.entries(obj).map(([key, value]): TreeNode => {
        if (value && typeof value === 'object') {
          return { name: key, children: processObject(value) };
        }
        return { name: key, value: String(value) };
      });
    };

    root.children = processObject(data);
    return root;
  } catch {
    return null;
  }
}

export type RenderOptions = {
  searchQuery?: string;
};

export function renderTree(container: HTMLDivElement, data: TreeNode, options?: RenderOptions) {
  if (!container || !data) return;

  d3.select(container).selectAll('*').remove();

  const nodeCount = d3.hierarchy(data).descendants().length;
  const minHeight = Math.max(560, nodeCount * 30);
  const width = 960;
  const height = Math.max(minHeight, 560);
  const margin = { top: 20, right: 200, bottom: 20, left: 150 };

  const zoom = d3
    .zoom()
    .scaleExtent([0.2, 3])
    .on('zoom', (event) => {
      svg.attr('transform', event.transform);
    });

  const svgContainer = d3
    .select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('background', 'linear-gradient(135deg, #0b1020 0%, #111827 50%, #0b1020 100%)')
    .call(zoom as any);

  svgContainer
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all');

  const svg = svgContainer
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const tree = d3
    .tree<TreeNode>()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
    .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.6));

  const root = d3.hierarchy(data) as HierarchyNode;
  const links = tree(root).links() as HierarchyLink[];
  const nodes = root.descendants() as HierarchyNode[];

  // defs for glow
  const defs = svg.append('defs');
  const glow = defs
    .append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
  glow.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
  const feMerge = glow.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  svg
    .selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr('d', d3.linkHorizontal<HierarchyLink, HierarchyNode>().x((d) => d.y).y((d) => d.x))
    .style('fill', 'none')
    .style('stroke', 'url(#linkGradient)')
    .style('stroke-opacity', 0.9)
    .style('stroke-width', 1.8);

  // gradient for links
  const linkGradient = defs
    .append('linearGradient')
    .attr('id', 'linkGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');
  linkGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4');
  linkGradient.append('stop').attr('offset', '100%').attr('stop-color', '#7c3aed');

  const node = svg
    .selectAll('g.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.y},${d.x})`);

  const search = (options?.searchQuery || '').trim().toLowerCase();
  const isMatch = (label: string, value?: string) => {
    if (!search) return false;
    return label.toLowerCase().includes(search) || (value ? value.toLowerCase().includes(search) : false);
  };

  node
    .append('circle')
    .attr('r', 6)
    .style('fill', (d) => (isMatch(d.data.name, d.data.value) ? '#22d3ee' : '#4f46e5'))
    .style('stroke', (d) => (isMatch(d.data.name, d.data.value) ? '#a78bfa' : '#818cf8'))
    .style('stroke-width', 2)
    .style('filter', (d) => (isMatch(d.data.name, d.data.value) ? 'url(#glow)' : 'none'))
    .style('cursor', 'pointer')
    .on('mouseover', function () {
      d3.select(this).transition().duration(200).attr('r', 8).style('fill', '#6366f1');
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration(200).attr('r', 6).style('fill', '#4f46e5');
    });

  node
    .append('text')
    .attr('dy', '0.31em')
    .attr('x', (d) => (d.children ? -12 : 12))
    .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.name)
    .style('font-size', '13px')
    .style('font-family', 'monospace')
    .style('fill', (d) => (isMatch(d.data.name, d.data.value) ? '#e0e7ff' : '#f3f4f6'))
    .style('paint-order', 'stroke')
    .style('stroke', '#111827')
    .style('stroke-width', '2.5px')
    .style('stroke-linecap', 'round')
    .style('stroke-linejoin', 'round');

  node
    .filter((d) => !d.children && d.data.value !== undefined)
    .append('text')
    .attr('dy', '1.3em')
    .attr('x', 12)
    .attr('text-anchor', 'start')
    .text((d) => `: ${d.data.value}`)
    .style('font-size', '12px')
    .style('font-family', 'monospace')
    .style('fill', (d) => (isMatch(d.data.name, d.data.value) ? '#a5b4fc' : '#93c5fd'))
    .style('opacity', 0.9);

  const rootNode = nodes[0];
  const lastNode = nodes[nodes.length - 1];
  const bounds = { x: [rootNode.x, lastNode.x], y: [rootNode.y, lastNode.y] };
  const dx = bounds.x[1] - bounds.x[0];
  const dy = bounds.y[1] - bounds.y[0];
  const x = (bounds.x[0] + bounds.x[1]) / 2;
  const y = (bounds.y[0] + bounds.y[1]) / 2;
  const scale = Math.max(0.2, Math.min(2, 0.9 / Math.max(dx / height, dy / width)));
  const translate = [width / 2 - scale * y, height / 2 - scale * x];

  svgContainer
    .transition()
    .duration(750)
    .call(zoom.transform as any, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
}


