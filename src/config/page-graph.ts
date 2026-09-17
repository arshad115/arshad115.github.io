import type { GraphConfig } from 'starlight-site-graph/config';

type ContentType = 'post' | 'portfolio' | 'til' | 'page' | undefined;

/**
 * Centralized graph tuning knobs for page-level sidebars.
 * Keep this file as the single source of truth for graph behavior.
 */
const graphKnobs = {
  controls: ['fullscreen', 'reset-zoom'] as const,
  depth: 1,
  depthDirection: 'both' as const,
  renderLabels: true,
  renderExternal: false,
  renderUnresolved: false,
  followLink: 'same' as const,
  enableDrag: true,
  enablePan: true,
  enableZoom: true,
  enableHover: true,
  enableClick: 'click' as const,
  prefetchPages: false,
  alphaDecay: 0.06,
  centerForce: 0.14,
  repelForce: 260,
  colliderPadding: 26,
  linkWidth: 0.9,
  linkHoverWidth: 1.4,
  labelFontSize: 10,
  labelOffset: 8,
  labelHoverOffset: 11,
  labelHoverScale: 1.05,
  labelMutedOpacity: 0.015,
  labelAdjacentOpacity: 0.75,
  labelHoverOpacity: 1,
  hoverDuration: 110,
  zoomDuration: 70,
};

function baseRelatedConfig(): Partial<GraphConfig> {
  return {
    actions: [...graphKnobs.controls],
    depth: graphKnobs.depth,
    depthDirection: graphKnobs.depthDirection,
    renderLabels: graphKnobs.renderLabels,
    renderExternal: graphKnobs.renderExternal,
    renderUnresolved: graphKnobs.renderUnresolved,
    followLink: graphKnobs.followLink,
    enableDrag: graphKnobs.enableDrag,
    enablePan: graphKnobs.enablePan,
    enableZoom: graphKnobs.enableZoom,
    enableHover: graphKnobs.enableHover,
    enableClick: graphKnobs.enableClick,
    prefetchPages: graphKnobs.prefetchPages,
    alphaDecay: graphKnobs.alphaDecay,
    centerForce: graphKnobs.centerForce,
    repelForce: graphKnobs.repelForce,
    colliderPadding: graphKnobs.colliderPadding,
    linkWidth: graphKnobs.linkWidth,
    linkHoverWidth: graphKnobs.linkHoverWidth,
    labelFontSize: graphKnobs.labelFontSize,
    labelOffset: graphKnobs.labelOffset,
    labelHoverOffset: graphKnobs.labelHoverOffset,
    labelHoverScale: graphKnobs.labelHoverScale,
    labelMutedOpacity: graphKnobs.labelMutedOpacity,
    labelAdjacentOpacity: graphKnobs.labelAdjacentOpacity,
    labelHoverOpacity: graphKnobs.labelHoverOpacity,
    hoverDuration: graphKnobs.hoverDuration,
    zoomDuration: graphKnobs.zoomDuration,
  };
}

export function getPageGraphConfig(contentType?: ContentType): Partial<GraphConfig> {
  const config = baseRelatedConfig();

  // Slightly richer graph for portfolio pages, still local-focused.
  if (contentType === 'portfolio') {
    return {
      ...config,
      depth: 2,
      alphaDecay: 0.07,
    };
  }

  return config;
}

export { graphKnobs };
