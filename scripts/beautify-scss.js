#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * CSS Property Order Sequence
 * Based on css_sequence_template.scss
 */
const CSS_PROPERTY_ORDER = [
  // 1. Positioning
  'position', 'top', 'right', 'bottom', 'left', 'z-index', 'inset',
  
  // 2. Display & Layout
  'display', 'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-basis',
  'justify-content', 'align-items', 'align-content', 'align-self', 'gap', 'row-gap', 'column-gap',
  'grid', 'grid-template', 'grid-auto-flow', 'grid-column', 'grid-row', 'place-items', 'place-content',
  'order',
  
  // 3. Sizing
  'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
  'aspect-ratio', 'size',
  
  // 4. Spacing
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  
  // 5. Overflow
  'overflow', 'overflow-x', 'overflow-y', 'overflow-wrap', 'overflow-anchor',
  'text-overflow', 'white-space', 'touch-action', 'overscroll-behavior', 'overscroll-behavior-x', 'overscroll-behavior-y',
  
  // 6. Borders
  'border', 'border-width', 'border-style', 'border-color',
  'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'border-spacing', 'border-collapse', 'outline', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
  
  // 7. Background
  'background', 'background-color', 'background-image', 'background-position', 'background-size', 'background-repeat', 'background-attachment', 'background-clip',
  'background-origin', 'background-blend-mode',
  
  // 8. Effects
  'box-shadow', 'text-shadow', 'opacity', 'filter', 'mix-blend-mode', 'clip-path', 'mask',
  'visibility',
  
  // 9. Typography
  'color', 'fill', 'stroke', 'font', 'font-family', 'font-size', 'font-size-adjust', 'font-weight', 'font-style',
  'font-variant', 'font-stretch', 'line-height', 'letter-spacing', 'word-spacing', 'text-align', 'text-align-last',
  'text-decoration', 'text-decoration-line', 'text-decoration-style', 'text-decoration-color', 'text-transform',
  'text-indent', 'text-shadow', 'text-rendering', 'text-orientation', 'font-smoothing',
  
  // 10. Transforms & Animations
  'transform', 'transform-origin', 'transform-style', 'perspective', 'perspective-origin',
  'transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',
  'animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode',
  
  // 11. Interaction
  'cursor', 'pointer-events', 'user-select', 'user-drag', 'user-modify', 'resize', 'scroll-behavior',
  
  // 12. Misc
  'will-change', 'contain', 'content', 'counter-increment', 'counter-reset', 'tab-size',
  'hyphens', 'orphans', 'widows', 'page-break-before', 'page-break-after', 'page-break-inside',
  'box-sizing', 'box-decoration-break'
];

/**
 * CSS Property Sections - map properties to their section number
 */
const PROPERTY_SECTIONS = {
  // 1. Positioning
  'position': 1, 'top': 1, 'right': 1, 'bottom': 1, 'left': 1, 'z-index': 1, 'inset': 1,
  
  // 2. Display & Layout
  'display': 2, 'flex': 2, 'flex-direction': 2, 'flex-wrap': 2, 'flex-flow': 2, 'flex-grow': 2, 'flex-shrink': 2, 'flex-basis': 2,
  'justify-content': 2, 'align-items': 2, 'align-content': 2, 'align-self': 2, 'gap': 2, 'row-gap': 2, 'column-gap': 2,
  'grid': 2, 'grid-template': 2, 'grid-auto-flow': 2, 'grid-column': 2, 'grid-row': 2, 'place-items': 2, 'place-content': 2, 'order': 2,
  
  // 3. Sizing
  'width': 3, 'min-width': 3, 'max-width': 3, 'height': 3, 'min-height': 3, 'max-height': 3, 'aspect-ratio': 3, 'size': 3,
  
  // 4. Spacing
  'margin': 4, 'margin-top': 4, 'margin-right': 4, 'margin-bottom': 4, 'margin-left': 4,
  'padding': 4, 'padding-top': 4, 'padding-right': 4, 'padding-bottom': 4, 'padding-left': 4,
  
  // 5. Overflow
  'overflow': 5, 'overflow-x': 5, 'overflow-y': 5, 'overflow-wrap': 5, 'overflow-anchor': 5,
  'text-overflow': 5, 'white-space': 5, 'touch-action': 5, 'overscroll-behavior': 5, 'overscroll-behavior-x': 5, 'overscroll-behavior-y': 5,
  
  // 6. Borders
  'border': 6, 'border-width': 6, 'border-style': 6, 'border-color': 6,
  'border-top': 6, 'border-right': 6, 'border-bottom': 6, 'border-left': 6,
  'border-radius': 6, 'border-top-left-radius': 6, 'border-top-right-radius': 6, 'border-bottom-right-radius': 6, 'border-bottom-left-radius': 6,
  'border-spacing': 6, 'border-collapse': 6, 'outline': 6, 'outline-width': 6, 'outline-style': 6, 'outline-color': 6, 'outline-offset': 6,
  
  // 7. Background
  'background': 7, 'background-color': 7, 'background-image': 7, 'background-position': 7, 'background-size': 7, 'background-repeat': 7, 'background-attachment': 7, 'background-clip': 7,
  'background-origin': 7, 'background-blend-mode': 7,
  
  // 8. Effects
  'box-shadow': 8, 'text-shadow': 8, 'opacity': 8, 'filter': 8, 'mix-blend-mode': 8, 'clip-path': 8, 'mask': 8, 'visibility': 8,
  
  // 9. Typography
  'color': 9, 'fill': 9, 'stroke': 9, 'font': 9, 'font-family': 9, 'font-size': 9, 'font-size-adjust': 9, 'font-weight': 9, 'font-style': 9,
  'font-variant': 9, 'font-stretch': 9, 'line-height': 9, 'letter-spacing': 9, 'word-spacing': 9, 'text-align': 9, 'text-align-last': 9,
  'text-decoration': 9, 'text-decoration-line': 9, 'text-decoration-style': 9, 'text-decoration-color': 9, 'text-transform': 9,
  'text-indent': 9, 'text-rendering': 9, 'text-orientation': 9, 'font-smoothing': 9,
  
  // 10. Transforms & Animations
  'transform': 10, 'transform-origin': 10, 'transform-style': 10, 'perspective': 10, 'perspective-origin': 10,
  'transition': 10, 'transition-property': 10, 'transition-duration': 10, 'transition-timing-function': 10, 'transition-delay': 10,
  'animation': 10, 'animation-name': 10, 'animation-duration': 10, 'animation-timing-function': 10, 'animation-delay': 10, 'animation-iteration-count': 10, 'animation-direction': 10, 'animation-fill-mode': 10,
  
  // 11. Interaction
  'cursor': 11, 'pointer-events': 11, 'user-select': 11, 'user-drag': 11, 'user-modify': 11, 'resize': 11, 'scroll-behavior': 11,
  
  // 12. Misc
  'will-change': 12, 'contain': 12, 'content': 12, 'counter-increment': 12, 'counter-reset': 12, 'tab-size': 12,
  'hyphens': 12, 'orphans': 12, 'widows': 12, 'page-break-before': 12, 'page-break-after': 12, 'page-break-inside': 12,
  'box-sizing': 12, 'box-decoration-break': 12
};

/**
 * Get property sort order
 */
function getPropertyOrder(prop) {
  const index = CSS_PROPERTY_ORDER.indexOf(prop);
  return index === -1 ? CSS_PROPERTY_ORDER.length : index;
}

/**
 * Get property section number
 */
function getPropertySection(prop) {
  return PROPERTY_SECTIONS[prop] || 13;
}

/**
 * Parse SCSS content and organize properties
 */
function beautifySCSS(content) {
  const lines = content.split('\n');
  let result = [];
  let buffer = [];
  let inSelector = false;
  let nestedLevel = 0;
  let currentIndent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments at start
    if (!trimmed || trimmed.startsWith('//')) {
      if (inSelector && buffer.length === 0) {
        result.push(line);
      } else if (!inSelector) {
        result.push(line);
      }
      continue;
    }

    // Detect selector start
    if (trimmed.includes('{') && !trimmed.includes('}')) {
      if (buffer.length > 0) {
        result.push(...organizProperties(buffer, currentIndent));
        buffer = [];
      }
      result.push(line);
      inSelector = true;
      nestedLevel++;
      currentIndent = line.match(/^\s*/)[0];
      continue;
    }

    // Detect selector end
    if (trimmed === '}' || trimmed.startsWith('}')) {
      if (buffer.length > 0) {
        result.push(...organizProperties(buffer, currentIndent));
        buffer = [];
      }
      result.push(line);
      nestedLevel--;
      if (nestedLevel === 0) {
        inSelector = false;
      }
      continue;
    }

    // Collect properties
    if (inSelector && trimmed && !trimmed.startsWith('@include')) {
      buffer.push(line);
    } else if (inSelector) {
      result.push(line);
    } else {
      result.push(line);
    }
  }

  // Process remaining buffer
  if (buffer.length > 0) {
    result.push(...organizProperties(buffer, currentIndent));
  }

  return result.join('\n');
}

/**
 * Organize properties by CSS order with section gaps
 */
function organizProperties(lines, indent) {
  const items = [];

  // Parse lines and associate comments with properties
  let pendingComments = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Collect comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      pendingComments.push(line);
      continue;
    }

    // Check if it's a CSS property
    if (trimmed.includes(':') && !trimmed.startsWith('&') && !trimmed.startsWith('@')) {
      const prop = trimmed.split(':')[0].trim();
      items.push({
        type: 'property',
        prop: prop,
        comments: pendingComments,
        line: line
      });
      pendingComments = [];
    } else {
      // Other non-property lines
      items.push({
        type: 'other',
        comments: pendingComments,
        line: line
      });
      pendingComments = [];
    }
  }

  // Add any remaining comments
  if (pendingComments.length > 0) {
    items.push({
      type: 'comment',
      comments: pendingComments,
      line: null
    });
  }

  // Sort items - properties by section/order, others stay at end
  const properties = items.filter(item => item.type === 'property');
  const others = items.filter(item => item.type !== 'property');

  properties.sort((a, b) => {
    const sectionDiff = getPropertySection(a.prop) - getPropertySection(b.prop);
    if (sectionDiff !== 0) return sectionDiff;
    return getPropertyOrder(a.prop) - getPropertyOrder(b.prop);
  });

  // Build result with proper gaps between sections
  const result = [];
  let currentSection = null;

  for (const item of properties) {
    const section = getPropertySection(item.prop);
    
    // Add gap between sections
    if (currentSection !== null && section !== currentSection && result.length > 0) {
      result.push('');
    }

    // Add comments before property
    for (const comment of item.comments) {
      result.push(comment);
    }

    result.push(item.line);
    currentSection = section;
  }

  // Add other items at the end
  if (others.length > 0) {
    if (result.length > 0) {
      result.push('');
    }
    for (const item of others) {
      for (const comment of item.comments) {
        result.push(comment);
      }
      if (item.line) {
        result.push(item.line);
      }
    }
  }

  return result;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run beautify -- <file-path>');
    console.log('Example: npm run beautify -- src/app/components/button/button.scss');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const beautified = beautifySCSS(content);

    fs.writeFileSync(filePath, beautified, 'utf-8');
    console.log(`✅ Successfully beautified: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
