# SCSS Beautifier Script

This script automatically reorganizes SCSS properties according to the CSS sequence defined in `src/assets/scss/css_sequence_template.scss`.

## Property Order

The script organizes CSS properties in the following order:

1. **Positioning** - position, top, right, bottom, left, z-index
2. **Display & Layout** - display, flex, justify-content, align-items, gap, etc.
3. **Sizing** - width, height, min-width, max-width, etc.
4. **Spacing** - margin, padding
5. **Overflow** - overflow, touch-action, overscroll-behavior
6. **Borders** - border, border-radius, outline
7. **Background** - background, background-color, background-image
8. **Effects** - box-shadow, opacity, filter, visibility
9. **Typography** - color, font, font-size, line-height, text-align
10. **Transforms & Animations** - transform, transition, animation
11. **Interaction** - cursor, pointer-events, user-select
12. **Misc** - will-change, contain, etc.

## Usage

### Run for a single file:
```bash
npm run beautify -- src/app/components/button/button.scss
```

### Run from the terminal:
Simply tell Copilot to execute the beautify script with the file path.

Example:
```
execute: npm run beautify -- src/app/global/components/meal-metrics/meal-metrics.scss
```

## Features

- ✅ Preserves all CSS values and properties
- ✅ Keeps original mixins (@include statements)
- ✅ Maintains nested selectors (&__modifier, &:hover, etc.)
- ✅ Preserves comments and blank lines
- ✅ Does NOT add comments from the template
- ✅ Handles complex SCSS structures

## Example

**Before:**
```scss
.stepper {
    display: flex;
    width: 204px;
    position: relative;
    background: var(--surface-primary-light);
    height: 100%;
}
```

**After:**
```scss
.stepper {
    position: relative;
    display: flex;
    width: 204px;
    height: 100%;
    background: var(--surface-primary-light);
}
```

## Notes

- The script modifies the file in place
- Always commit your changes before running the script
- The script respects nested selectors and mixins
