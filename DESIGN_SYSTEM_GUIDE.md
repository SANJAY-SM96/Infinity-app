# Design System Guide

## Overview

This document outlines the design system implemented across the Infinity application to ensure consistent UI/UX across all pages.

## Design System Utility

Located at: `frontend/src/utils/designSystem.js`

### Features

1. **Design Tokens**
   - Consistent spacing, border radius, shadows, transitions, and z-index values
   - Easy to maintain and update globally

2. **Common Classes**
   - Pre-built class combinations for common UI elements
   - Cards, buttons, inputs, badges, etc.
   - Dark mode support built-in

3. **Animation Variants**
   - Reusable animation patterns
   - Fade, slide, scale, and stagger animations
   - Consistent timing and easing

4. **Page Layout Helpers**
   - Consistent page wrapper and content containers
   - Dark mode gradients
   - Responsive spacing

## Usage Examples

### Using Design System in Components

```jsx
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark } = useTheme();
  const layoutClasses = getPageLayoutClasses(isDark);

  return (
    <main className={cn(layoutClasses.wrapper, 'pt-20')}>
      <div className={commonClasses.container}>
        <h1 className={cn(commonClasses.heading1(isDark))}>
          <span className={commonClasses.gradientText}>Title</span>
        </h1>
        <button className={commonClasses.buttonPrimary(isDark)}>
          Click Me
        </button>
      </div>
    </main>
  );
}
```

### Using PageLayout Component

```jsx
import PageLayout from '../components/PageLayout';

function MyPage() {
  return (
    <PageLayout
      title="Page Title"
      subtitle="Page description"
      showBackButton={true}
      headerActions={<button>Action</button>}
    >
      {/* Page content */}
    </PageLayout>
  );
}
```

## Design Principles

### 1. Consistency
- All pages use the same spacing scale
- Consistent button styles and sizes
- Uniform card designs
- Same animation timings

### 2. Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Focus states on all interactive elements
- Semantic HTML structure

### 3. Responsiveness
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly button sizes

### 4. Dark Mode
- All components support dark mode
- Smooth theme transitions
- Proper contrast ratios
- Consistent color schemes

## Component Patterns

### Cards
```jsx
<div className={commonClasses.card(isDark)}>
  {/* Card content */}
</div>

// With hover effect
<div className={commonClasses.cardHover(isDark)}>
  {/* Card content */}
</div>
```

### Buttons
```jsx
// Primary button
<button className={commonClasses.buttonPrimary(isDark)}>
  Primary Action
</button>

// Secondary button
<button className={commonClasses.buttonSecondary(isDark)}>
  Secondary Action
</button>

// Outline button
<button className={commonClasses.buttonOutline(isDark)}>
  Outline Action
</button>
```

### Inputs
```jsx
<input
  className={commonClasses.input(isDark)}
  type="text"
  placeholder="Enter text..."
/>

// With error
<input
  className={commonClasses.input(isDark, true)}
  type="text"
/>
```

### Badges
```jsx
<span className={commonClasses.badge(isDark, 'primary')}>
  New
</span>

<span className={commonClasses.badge(isDark, 'success')}>
  Active
</span>
```

## Animation Guidelines

### Page Transitions
- Use `fadeIn` for page loads
- Use `slideUp` for content sections
- Use `staggerContainer` + `staggerItem` for lists

### Interactive Elements
- Buttons: scale on hover (1.05), scale on tap (0.95)
- Cards: translate-y on hover (-2px to -4px)
- Links: smooth color transitions

### Timing
- Fast: 150ms (hover states)
- Normal: 200ms (default transitions)
- Slow: 300ms (page transitions)
- Slower: 500ms (complex animations)

## Color System

### Primary Colors
- Primary: `#2563EB` (Blue)
- Gradient: `from-primary via-blue-600 to-indigo-600`

### Text Colors
- Light mode: `text-gray-900` (headings), `text-gray-700` (body), `text-gray-600` (muted)
- Dark mode: `text-white` (headings), `text-gray-300` (body), `text-gray-400` (muted)

### Background Colors
- Light mode: `bg-white` (cards), `bg-gray-50` (page)
- Dark mode: `bg-gray-800` (cards), `bg-gray-900` (page)

## Spacing Scale

- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

## Typography

### Headings
- H1: `text-3xl sm:text-4xl lg:text-5xl font-extrabold`
- H2: `text-2xl sm:text-3xl lg:text-4xl font-bold`
- H3: `text-xl sm:text-2xl font-semibold`

### Body Text
- Default: `text-base` (16px)
- Large: `text-lg` (18px)
- Small: `text-sm` (14px)

## Best Practices

1. **Always use design system utilities** instead of hardcoding styles
2. **Test in both light and dark modes**
3. **Ensure responsive behavior** on all screen sizes
4. **Use semantic HTML** for accessibility
5. **Add proper ARIA labels** for screen readers
6. **Maintain consistent spacing** using the spacing scale
7. **Use animation variants** for consistent motion
8. **Test keyboard navigation** for all interactive elements

## Updated Pages

### ✅ Completed
- ProductList.jsx - Enhanced with design system
- Design System Utility created
- PageLayout component created

### 🔄 In Progress
- ProductDetails.jsx
- Cart.jsx
- Checkout.jsx
- Dashboard pages
- About.jsx
- Contact.jsx

## Next Steps

1. Apply design system to remaining pages
2. Create reusable form components
3. Enhance loading states
4. Improve error states
5. Add skeleton loaders
6. Create consistent modal/dialog components

