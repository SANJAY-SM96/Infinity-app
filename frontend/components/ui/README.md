# Headless UI Components

This directory contains reusable UI components built with [Headless UI](https://headlessui.com/) and integrated with our design system.

## Components

### Modal
A fully accessible modal/dialog component with animations.

```jsx
import { Modal } from '../components/ui';
import { useState } from 'react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="Optional description"
        size="md" // sm, md, lg, xl, 2xl, full
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Dropdown
A dropdown menu component with keyboard navigation.

```jsx
import { Dropdown } from '../components/ui';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';

function Example() {
  const items = [
    { label: 'Edit', icon: <FiEdit />, onClick: () => console.log('Edit') },
    { label: 'Delete', icon: <FiTrash2 />, onClick: () => console.log('Delete'), danger: true },
  ];

  return (
    <Dropdown
      trigger={<button><FiMoreVertical /></button>}
      items={items}
      align="right" // left or right
    />
  );
}
```

### Tabs
A tabbed interface component.

```jsx
import { Tabs } from '../components/ui';
import { FiUser, FiSettings } from 'react-icons/fi';

function Example() {
  const tabs = [
    {
      label: 'Profile',
      icon: <FiUser />,
      content: <div>Profile content</div>
    },
    {
      label: 'Settings',
      icon: <FiSettings />,
      content: <div>Settings content</div>
    }
  ];

  return <Tabs tabs={tabs} defaultIndex={0} />;
}
```

### Disclosure (Accordion)
An accordion component for collapsible content.

```jsx
import { Disclosure } from '../components/ui';

function Example() {
  const items = [
    {
      title: 'What is this?',
      content: <p>This is the answer to the question.</p>
    },
    {
      title: 'How does it work?',
      content: <p>Here's how it works...</p>
    }
  ];

  return <Disclosure items={items} defaultOpen={false} />;
}
```

### Popover
A popover component for tooltips and floating content.

```jsx
import { Popover } from '../components/ui';

function Example() {
  return (
    <Popover
      trigger={<button>Hover me</button>}
      position="bottom" // top, bottom, left, right
    >
      <p>Popover content</p>
    </Popover>
  );
}
```

## Features

- ✅ Fully accessible (ARIA compliant)
- ✅ Keyboard navigation support
- ✅ Dark mode support
- ✅ Integrated with design system
- ✅ Smooth animations
- ✅ TypeScript ready (if you migrate)

## Integration with Design System

All components automatically use:
- Theme context for dark/light mode
- Design system tokens for spacing, colors, and shadows
- Consistent styling with the rest of the application

## Best Practices

1. Always provide proper labels for accessibility
2. Use icons from `react-icons/fi` for consistency
3. Test keyboard navigation (Tab, Enter, Escape)
4. Ensure proper focus management
5. Use appropriate sizes for modals based on content

