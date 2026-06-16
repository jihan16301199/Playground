#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * CSS Property Order Sequence
 * Based on css_sequence_template.scss
 */
const CSS_PROPERTY_ORDER = [
  // 1. Positioning
  'content', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'inset',
  'inset-inline', 'inset-inline-start', 'inset-inline-end',
  'inset-block', 'inset-block-start', 'inset-block-end',
  
  // 2. Display & Layout
  // 2.1 flex child
  'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'order', 'grid-column', 'grid-row',
  // 2.2 flex parent
  'display', 'flex-direction', 'flex-wrap', 'flex-flow', 'justify-content', 'align-items', 'align-content',
  'gap', 'row-gap', 'column-gap', 'grid', 'grid-template', 'grid-auto-flow', 'place-items', 'place-content',
  
  // 3. Sizing
  'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
  'aspect-ratio', 'size',
  
  // 4. Spacing
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'margin-inline', 'margin-inline-start', 'margin-inline-end',
  'margin-block', 'margin-block-start', 'margin-block-end',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'padding-inline', 'padding-inline-start', 'padding-inline-end',
  'padding-block', 'padding-block-start', 'padding-block-end',
  
  // 5. Overflow
  'overflow', 'overflow-x', 'overflow-y', 'overflow-wrap', 'overflow-anchor',
  'text-overflow', 'white-space', 'touch-action', 'overscroll-behavior', 'overscroll-behavior-x', 'overscroll-behavior-y',
  
  // 6. Borders
  'color', 'fill', 'stroke', 'border', 'border-width', 'border-style', 'border-color',
  'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-inline', 'border-inline-start', 'border-inline-end',
  'border-block', 'border-block-start', 'border-block-end',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'border-spacing', 'border-collapse', 'outline', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
  
  // 7. Background
  'background', 'background-color', 'background-image', 'background-position', 'background-size', 'background-repeat', 'background-attachment', 'background-clip',
  'background-origin', 'background-blend-mode', 'backdrop-filter',
  
  // 8. Effects
  'box-shadow', 'text-shadow', 'opacity', 'filter', 'mix-blend-mode', 'clip-path', 'mask',
  'visibility',
  
  // 9. Typography
  'font', 'font-family', 'font-size', 'font-size-adjust', 'font-style', 'font-weight',
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
  'will-change', 'contain', 'counter-increment', 'counter-reset', 'tab-size',
  'hyphens', 'orphans', 'widows', 'page-break-before', 'page-break-after', 'page-break-inside',
  'box-sizing', 'box-decoration-break'
];

/**
 * CSS Property Sections - map properties to their section number
 */
const PROPERTY_SECTIONS = {
  // 1. Positioning
  'content': 1, 'position': 1, 'top': 1, 'right': 1, 'bottom': 1, 'left': 1, 'z-index': 1, 'inset': 1,
  'inset-inline': 1, 'inset-inline-start': 1, 'inset-inline-end': 1,
  'inset-block': 1, 'inset-block-start': 1, 'inset-block-end': 1,
  
  // 2. Display & Layout
  'flex': 2, 'flex-grow': 2, 'flex-shrink': 2, 'flex-basis': 2, 'align-self': 2, 'order': 2, 'grid-column': 2, 'grid-row': 2,
  'display': 2, 'flex-direction': 2, 'flex-wrap': 2, 'flex-flow': 2, 'justify-content': 2, 'align-items': 2, 'align-content': 2,
  'gap': 2, 'row-gap': 2, 'column-gap': 2, 'grid': 2, 'grid-template': 2, 'grid-auto-flow': 2, 'place-items': 2, 'place-content': 2,
  
  // 3. Sizing
  'width': 3, 'min-width': 3, 'max-width': 3, 'height': 3, 'min-height': 3, 'max-height': 3, 'aspect-ratio': 3, 'size': 3,
  
  // 4. Spacing
  'margin': 4, 'margin-top': 4, 'margin-right': 4, 'margin-bottom': 4, 'margin-left': 4,
  'margin-inline': 4, 'margin-inline-start': 4, 'margin-inline-end': 4,
  'margin-block': 4, 'margin-block-start': 4, 'margin-block-end': 4,
  'padding': 4, 'padding-top': 4, 'padding-right': 4, 'padding-bottom': 4, 'padding-left': 4,
  'padding-inline': 4, 'padding-inline-start': 4, 'padding-inline-end': 4,
  'padding-block': 4, 'padding-block-start': 4, 'padding-block-end': 4,
  
  // 5. Overflow
  'overflow': 5, 'overflow-x': 5, 'overflow-y': 5, 'overflow-wrap': 5, 'overflow-anchor': 5,
  'text-overflow': 5, 'white-space': 5, 'touch-action': 5, 'overscroll-behavior': 5, 'overscroll-behavior-x': 5, 'overscroll-behavior-y': 5,
  
  // 6. Borders
  'color': 6, 'fill': 6, 'stroke': 6, 'border': 6, 'border-width': 6, 'border-style': 6, 'border-color': 6,
  'border-top': 6, 'border-right': 6, 'border-bottom': 6, 'border-left': 6,
  'border-inline': 6, 'border-inline-start': 6, 'border-inline-end': 6,
  'border-block': 6, 'border-block-start': 6, 'border-block-end': 6,
  'border-radius': 6, 'border-top-left-radius': 6, 'border-top-right-radius': 6, 'border-bottom-right-radius': 6, 'border-bottom-left-radius': 6,
  'border-spacing': 6, 'border-collapse': 6, 'outline': 6, 'outline-width': 6, 'outline-style': 6, 'outline-color': 6, 'outline-offset': 6,
  
  // 7. Background
  'background': 7, 'background-color': 7, 'background-image': 7, 'background-position': 7, 'background-size': 7, 'background-repeat': 7, 'background-attachment': 7, 'background-clip': 7,
  'background-origin': 7, 'background-blend-mode': 7, 'backdrop-filter': 7,
  
  // 8. Effects
  'box-shadow': 8, 'text-shadow': 8, 'opacity': 8, 'filter': 8, 'mix-blend-mode': 8, 'clip-path': 8, 'mask': 8, 'visibility': 8,
  
  // 9. Typography
  'font': 9, 'font-family': 9, 'font-size': 9, 'font-size-adjust': 9, 'font-weight': 9, 'font-style': 9,
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
  'will-change': 12, 'contain': 12, 'counter-increment': 12, 'counter-reset': 12, 'tab-size': 12,
  'hyphens': 12, 'orphans': 12, 'widows': 12, 'page-break-before': 12, 'page-break-after': 12, 'page-break-inside': 12,
  'box-sizing': 12, 'box-decoration-break': 12
};

/**
 * Determine if an @include mixin is typography-related
 */
function isTypographyMixin(mixinName) {
  const typographyPatterns = [
    'title', 'headline', 'body', 'label', 'caption', 'overline',
    'font', 'text', 'regular', 'medium', 'semibold', 'bold', 'demibold'
  ];
  return typographyPatterns.some(pattern => mixinName.toLowerCase().includes(pattern));
}

/**
 * Get section for @include mixins
 */
function getIncludeSection(line) {
  const mixinMatch = line.match(/@include\s+([a-zA-Z0-9_-]+)/);
  if (mixinMatch && isTypographyMixin(mixinMatch[1])) {
    return 9; // Typography section
  }
  return 13; // Default/Misc
}

/**
 * Get property sort order, with special handling for Typography section
 */
function getPropertyOrder(prop, section) {
  // Within Typography section, prioritize color/fill/stroke first
  if (section === 9) {
    if (prop === 'color') return -1002;
    if (prop === 'fill') return -1001;
    if (prop === 'stroke') return -1000;
  }
  const index = CSS_PROPERTY_ORDER.indexOf(prop);
  return index === -1 ? CSS_PROPERTY_ORDER.length : index;
}

/**
 * Get include order within a section
 */
function getIncludeOrder(section) {
  // In Typography section, includes come after color/fill/stroke but before other typography
  if (section === 9) {
    return -100;
  }
  return 0;
}

/**
 * Get property section number
 */
function getPropertySection(prop) {
  return PROPERTY_SECTIONS[prop] || 13;
}

/**
 * Determine if a property belongs to flex child subsection (2.1)
 */
function isFlexChildProperty(prop) {
  const flexChildProps = ['flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'order', 'grid-column', 'grid-row'];
  return flexChildProps.includes(prop);
}

/**
 * Determine if a property belongs to flex parent subsection (2.2)
 */
function isFlexParentProperty(prop) {
  const flexParentProps = ['display', 'flex-direction', 'flex-wrap', 'flex-flow', 'justify-content', 'align-items', 'align-content', 'gap', 'row-gap', 'column-gap', 'grid', 'grid-template', 'grid-auto-flow', 'place-items', 'place-content'];
  return flexParentProps.includes(prop);
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
  let selectorBuffer = []; // Buffer for multi-line selector parts

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines at start but add to buffer if in selector
    if (!trimmed) {
      if (inSelector && selectorBuffer.length === 0) {
        buffer.push(line);
      } else if (selectorBuffer.length > 0) {
        selectorBuffer.push(line);
      } else {
        result.push(line);
      }
      continue;
    }

    // Handle comments - add to buffer if in selector, otherwise to result
    if (trimmed.startsWith('//')) {
      if (inSelector && selectorBuffer.length === 0) {
        buffer.push(line);
      } else if (selectorBuffer.length > 0) {
        selectorBuffer.push(line);
      } else {
        result.push(line);
      }
      continue;
    }

    // Detect multi-line selector parts (lines starting with & and ending with comma)
    const isMultiLineSelectorPart = (trimmed.startsWith('&') || trimmed.startsWith('.') || trimmed.startsWith('#')) && 
                                     trimmed.endsWith(',') && 
                                     !trimmed.includes('{');

    // If we're collecting selector parts, check if this line continues the pattern
    if (selectorBuffer.length > 0) {
      if (isMultiLineSelectorPart || trimmed.endsWith(',')) {
        selectorBuffer.push(line);
        continue;
      } else if (trimmed.includes('{')) {
        // Found the opening brace - output all selector parts with the brace
        result.push(...selectorBuffer);
        result.push(line);
        selectorBuffer = [];
        inSelector = true;
        nestedLevel++;
        currentIndent = line.match(/^\s*/)[0];
        continue;
      }
    }

    // Start collecting multi-line selector parts
    if (inSelector && isMultiLineSelectorPart && selectorBuffer.length === 0) {
      if (buffer.length > 0) {
        result.push(...organizProperties(buffer, currentIndent));
        buffer = [];
      }
      selectorBuffer.push(line);
      continue;
    }

    // Detect selector start (including nested selectors with &)
    const hasOpenBrace = trimmed.includes('{') && !trimmed.includes('}');
    const isNestedSelector = trimmed.startsWith('&') && hasOpenBrace;
    const isRegularSelector = !trimmed.startsWith('&') && hasOpenBrace;
    
    if (isNestedSelector || isRegularSelector) {
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
    if (trimmed === '}' || (trimmed.startsWith('}') && !trimmed.includes('{'))) {
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

    // Collect properties and includes for organization
    if (inSelector && trimmed && !trimmed.startsWith('@media')) {
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
 * Extract property name from a commented line
 * e.g., "// flex-direction: column;" -> "flex-direction"
 */
function getPropertyFromComment(commentLine) {
  const trimmed = commentLine.trim();
  if (!trimmed.startsWith('//')) return null;
  
  const content = trimmed.substring(2).trim(); // Remove "//"
  const colonIndex = content.indexOf(':');
  
  if (colonIndex > 0) {
    return content.substring(0, colonIndex).trim();
  }
  
  return null;
}

/**
 * Get section for a comment based on what property it describes
 */
function getCommentSection(commentLine) {
  const prop = getPropertyFromComment(commentLine);
  if (!prop) return 13; // Default to "other"
  return getPropertySection(prop);
}

/**
 * Organize properties by CSS order while preserving comment grouping by section
 */
function organizProperties(lines, indent) {
  if (lines.length === 0) return [];

  const items = [];
  let i = 0;
  let preservedCommentBuffer = []; // Buffer to store preserved comments before next property

  // Helper to check if a comment should be preserved in place (not sorted)
  function isPreservedComment(line) {
    const trimmed = line.trim();
    return trimmed.includes('// @') || trimmed.startsWith('/*') || trimmed.startsWith('*');
  }

  // First pass: Parse all items individually
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Handle comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      if (isPreservedComment(line)) {
        // Add to preserved comment buffer instead of items
        preservedCommentBuffer.push(line);
        i++;
        continue;
      }

      const propName = getPropertyFromComment(line);
      const commentSection = getCommentSection(line);
      const commentOrder = propName ? getPropertyOrder(propName, commentSection) : 999;
      
      items.push({
        type: 'comment',
        lines: [line],
        section: commentSection,
        order: commentOrder
      });
      i++;
      continue;
    }

    // Check if it's a CSS property
    if (trimmed.includes(':') && !trimmed.startsWith('&') && !trimmed.startsWith('@')) {
      const prop = trimmed.split(':')[0].trim();
      let propertyLines = [line];
      let j = i + 1;
      let propertyEnded = line.trim().endsWith(';'); // Check if property ends on first line

      // Collect multi-line property values
      while (j < lines.length && !propertyEnded) {
        const nextLine = lines[j];
        const nextTrimmed = nextLine.trim();

        if (!nextTrimmed) {
          j++;
          continue;
        }

        // Check if this line is a comment
        const isCommentLine = nextTrimmed.startsWith('//') || 
                             nextTrimmed.startsWith('/*') || 
                             nextTrimmed.startsWith('*');

        // Check if this line is a new property or selector
        const isNewProperty = nextTrimmed.includes(':') && !nextTrimmed.startsWith('//');
        const isNewSelector = nextTrimmed.startsWith('&') || nextTrimmed.startsWith('@') || nextTrimmed === '}';

        // If it's a new property or selector, stop
        if (isNewProperty || isNewSelector) {
          break;
        }

        // If it's a comment line AND the previous line ended with semicolon, it's a standalone comment
        if (isCommentLine && propertyLines[propertyLines.length - 1].trim().endsWith(';')) {
          break;
        }

        // Otherwise, add the line (including comments within multi-line values)
        propertyLines.push(nextLine);
        
        // Check if property ended with this line
        if (nextTrimmed.endsWith(';') || nextTrimmed === '}') {
          propertyEnded = true;
        }
        
        j++;
      }

      // Attach preserved comments to this property
      items.push({
        type: 'property',
        prop: prop,
        lines: propertyLines,
        section: getPropertySection(prop),
        order: getPropertyOrder(prop, getPropertySection(prop)),
        preservedCommentsBefore: preservedCommentBuffer
      });
      preservedCommentBuffer = [];

      i = j;
    } else if (trimmed.startsWith('@include')) {
      items.push({
        type: 'include',
        prop: trimmed,
        lines: [line],
        section: getIncludeSection(line),
        order: getIncludeOrder(getIncludeSection(line))
      });
      preservedCommentBuffer = [];

      i++;
    } else {
      i++;
    }
  }

  // Add order calculation for includes (which don't have order yet)
  for (const item of items) {
    if (item.type === 'include' && !item.order) {
      item.order = 0; // Includes have no specific order within section
    }
  }

  // Second pass: Sort by section, then by order (for both properties and comments)
  items.sort((a, b) => {
    if (a.section !== b.section) return a.section - b.section;
    
    // Within same section, sort by order
    return (a.order || 0) - (b.order || 0);
  });

  // Third pass: Group consecutive comments
  const finalItems = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (item.type === 'comment') {
      let commentLines = [item];
      let j = i + 1;
      
      // Look ahead for consecutive comments
      while (j < items.length && items[j].type === 'comment') {
        commentLines.push(items[j]);
        j++;
      }
      
      const commentLineTexts = commentLines.flatMap(c => c.lines);
      
      // Create comment block - preserve section from comments
      finalItems.push({
        type: 'comment-block',
        lines: commentLineTexts,
        section: commentLines[0].section
      });
      
      i = j - 1; // Skip grouped items
    } else {
      finalItems.push(item);
    }
  }

  // Build result with visual spacing after key sections
  const result = [];
  let previousSection = null;
  let previousWasFlexChild = false;
  const sectionsForSpacing = [1, 2, 4, 7, 9]; // Positioning, Display & Layout, Spacing, Background, Typography

  // Only apply spacing if the block has 6+ lines
  const shouldApplySpacing = lines.length >= 6;

  for (const item of finalItems) {
    // Output preserved comments before this item
    if (item.preservedCommentsBefore && item.preservedCommentsBefore.length > 0) {
      for (const commentLine of item.preservedCommentsBefore) {
        result.push(commentLine);
      }
    }

    // Add empty line if we've transitioned to a new section and previous was a spacing section
    if (shouldApplySpacing && previousSection !== null && previousSection !== item.section && sectionsForSpacing.includes(previousSection)) {
      result.push('');
    }

    // Check if transitioning from flex child to flex parent (within section 2)
    if (item.type === 'property' && item.section === 2) {
      if (previousWasFlexChild && isFlexParentProperty(item.prop)) {
        result.push('');
      }
    }

    for (const line of item.lines) {
      result.push(line);
    }

    // Track if this item is a flex child property
    if (item.type === 'property' && isFlexChildProperty(item.prop)) {
      previousWasFlexChild = true;
    } else if (item.type === 'property' && item.section === 2) {
      previousWasFlexChild = false;
    }

    previousSection = item.section;
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
