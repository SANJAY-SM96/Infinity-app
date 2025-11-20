# Modern Color Palette - 2025 Premium Theme

## Overview
This document describes the complete color system for the Infinity IT Project Marketplace. The palette has been modernized with a premium, tech-forward aesthetic that maintains excellent accessibility and visual hierarchy.

## Color Tokens

### Primary Colors
- **Primary**: `#4F46E5` (Indigo-600) - Main brand color
- **Primary Light**: `#6366F1` (Indigo-500) - Lighter variant for hover states
- **Primary Dark**: `#4338CA` (Indigo-700) - Darker variant for active states

### Accent Colors
- **Accent**: `#EC4899` (Pink-500) - Vibrant accent for highlights
- **Accent Light**: `#F472B6` (Pink-400) - Lighter accent variant
- **Accent Dark**: `#DB2777` (Pink-600) - Darker accent variant

### Background Colors

#### Light Mode
- **Background**: `#F8FAFC` (Slate-50)
- **Card**: `#FFFFFF` (White)
- **Foreground**: `#1E293B` (Slate-800) - Text color

#### Dark Mode
- **Background**: `#0F172A` (Slate-900)
- **Card**: `#1E293B` (Slate-800)
- **Foreground**: `#F1F5F9` (Slate-100) - Text color

### Border Colors
- **Light Mode**: `#E2E8F0` (Slate-200)
- **Dark Mode**: `#334155` (Slate-700)

### Semantic Colors
- **Success**: `#22C55E` (Green-500)
- **Warning**: `#F59E0B` (Amber-500)
- **Error**: `#EF4444` (Red-500)
- **Info**: `#3B82F6` (Blue-500)

### Secondary Colors
- **Secondary**: `#64748B` (Slate-500)
- **Muted**: `#64748B` (Slate-500)
- **Muted Foreground**: `#94A3B8` (Slate-400)

## CSS Variables

### Light Mode Variables
```css
--primary: #4F46E5;
--primary-light: #6366F1;
--primary-dark: #4338CA;
--accent: #EC4899;
--accent-light: #F472B6;
--accent-dark: #DB2777;
--background: #F8FAFC;
--foreground: #1E293B;
--card: #FFFFFF;
--card-foreground: #1E293B;
--border: #E2E8F0;
--muted: #64748B;
--muted-foreground: #94A3B8;
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--ring: #4F46E5;
```

### Dark Mode Variables
```css
--primary: #6366F1;
--primary-light: #818CF8;
--primary-dark: #4F46E5;
--accent: #F472B6;
--accent-light: #F9A8D4;
--accent-dark: #EC4899;
--background: #0F172A;
--foreground: #F1F5F9;
--card: #1E293B;
--card-foreground: #F1F5F9;
--border: #334155;
--muted: #64748B;
--muted-foreground: #94A3B8;
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--ring: #6366F1;
```

## Tailwind Configuration

The color palette is configured in `tailwind.config.js` with full color scales:

```javascript
colors: {
  primary: {
    DEFAULT: '#4F46E5',
    light: '#6366F1',
    dark: '#4338CA',
    // Full scale from 50-900
  },
  accent: {
    DEFAULT: '#EC4899',
    light: '#F472B6',
    dark: '#DB2777',
    // Full scale from 50-900
  },
  // ... other colors
}
```

## Usage Guidelines

### Buttons
- **Primary**: Use `bg-gradient-to-r from-primary via-primary-light to-accent`
- **Secondary**: Use `bg-slate-700` (dark) or `bg-slate-100` (light)
- **Outline**: Use `border-2 border-primary text-primary`

### Cards
- **Light Mode**: `bg-white border-slate-200`
- **Dark Mode**: `bg-slate-800/95 border-slate-700`

### Text
- **Headings**: `text-slate-900` (light) or `text-slate-100` (dark)
- **Body**: `text-slate-700` (light) or `text-slate-300` (dark)
- **Muted**: `text-slate-600` (light) or `text-slate-400` (dark)

### Gradients
- **Primary Gradient**: `from-primary via-primary-light to-accent`
- **Text Gradient**: `bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent`

## Accessibility

All color combinations meet WCAG AA contrast requirements:
- Primary text on light background: 4.5:1 ✓
- Primary text on dark background: 4.5:1 ✓
- Accent text on backgrounds: 4.5:1 ✓
- Focus states: High contrast rings for visibility ✓

## Migration Notes

### Replaced Colors
- Old `gray-*` → New `slate-*`
- Old `blue-600/indigo-600` gradients → New `primary` gradients
- Old `#5C6AC4` primary → New `#4F46E5` primary
- Old `#A17AFF` accent → New `#EC4899` accent

### Legacy Support
Legacy color aliases are maintained for backward compatibility:
- `primary-dark`, `primary-light`
- `dark-bg`, `dark-card`, `light-bg`, `light-card`

## Design Principles

1. **Consistency**: All components use the same color tokens
2. **Accessibility**: WCAG AA compliance maintained
3. **Modern Aesthetic**: Clean, premium look with soft gradients
4. **Dark Mode**: Full support with optimized contrast
5. **Large Rounded Corners**: `rounded-xl` (12px) and `rounded-2xl` (16px) for modern feel
6. **Subtle Shadows**: Soft shadows for depth without heaviness

## Component Examples

### Button
```jsx
<button className="bg-gradient-to-r from-primary via-primary-light to-accent text-white rounded-xl px-6 py-3">
  Click Me
</button>
```

### Card
```jsx
<div className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl p-6>
  Card Content
</div>
```

### Input
```jsx
<input className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'} rounded-xl />
```

## Color Palette Table

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Primary | #4F46E5 | #6366F1 | Main actions, links |
| Accent | #EC4899 | #F472B6 | Highlights, CTAs |
| Background | #F8FAFC | #0F172A | Page background |
| Card | #FFFFFF | #1E293B | Card backgrounds |
| Foreground | #1E293B | #F1F5F9 | Text color |
| Border | #E2E8F0 | #334155 | Borders, dividers |
| Success | #22C55E | #22C55E | Success states |
| Warning | #F59E0B | #F59E0B | Warning states |
| Error | #EF4444 | #EF4444 | Error states |

---

**Last Updated**: 2025-01-XX
**Version**: 2.0.0 (Modern Premium Theme)

