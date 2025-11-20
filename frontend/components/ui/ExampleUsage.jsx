import React, { useState } from 'react';
import { Modal, Dropdown, Tabs, Disclosure, Popover } from './index';
import { 
  FiMoreVertical, 
  FiEdit, 
  FiTrash2, 
  FiUser, 
  FiSettings, 
  FiBell,
  FiHelpCircle,
  FiInfo
} from 'react-icons/fi';
import { commonClasses } from '../../utils/designSystem';
import { useTheme } from '../../context/ThemeContext';

/**
 * Example component demonstrating all Headless UI components
 * This can be used as a reference for implementing these components in your pages
 */
export default function ExampleUsage() {
  const { isDark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dropdown items
  const dropdownItems = [
    { 
      label: 'Edit', 
      icon: <FiEdit />, 
      onClick: () => console.log('Edit clicked') 
    },
    { 
      label: 'Delete', 
      icon: <FiTrash2 />, 
      onClick: () => console.log('Delete clicked'),
      danger: true 
    },
  ];

  // Tabs configuration
  const tabs = [
    {
      label: 'Profile',
      icon: <FiUser />,
      content: (
        <div className={commonClasses.card(isDark)}>
          <h3 className={commonClasses.heading3(isDark)}>Profile Tab</h3>
          <p className={commonClasses.textBody(isDark)}>
            This is the profile tab content. You can add any content here.
          </p>
        </div>
      )
    },
    {
      label: 'Settings',
      icon: <FiSettings />,
      content: (
        <div className={commonClasses.card(isDark)}>
          <h3 className={commonClasses.heading3(isDark)}>Settings Tab</h3>
          <p className={commonClasses.textBody(isDark)}>
            This is the settings tab content. Configure your preferences here.
          </p>
        </div>
      )
    },
    {
      label: 'Notifications',
      icon: <FiBell />,
      content: (
        <div className={commonClasses.card(isDark)}>
          <h3 className={commonClasses.heading3(isDark)}>Notifications Tab</h3>
          <p className={commonClasses.textBody(isDark)}>
            Manage your notification preferences here.
          </p>
        </div>
      )
    }
  ];

  // Disclosure items (Accordion)
  const disclosureItems = [
    {
      title: 'What is Headless UI?',
      content: (
        <p className={commonClasses.textBody(isDark)}>
          Headless UI is a set of completely unstyled, fully accessible UI components
          designed to integrate beautifully with Tailwind CSS.
        </p>
      )
    },
    {
      title: 'How do I use these components?',
      content: (
        <p className={commonClasses.textBody(isDark)}>
          Simply import the components from the ui folder and use them in your pages.
          All components are integrated with the design system and theme context.
        </p>
      )
    },
    {
      title: 'Are these components accessible?',
      content: (
        <p className={commonClasses.textBody(isDark)}>
          Yes! All Headless UI components are built with accessibility in mind,
          including proper ARIA attributes and keyboard navigation support.
        </p>
      )
    }
  ];

  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className={commonClasses.heading1(isDark)}>
          Headless UI Components Examples
        </h1>
        <p className={commonClasses.textMuted(isDark)}>
          Examples of all available UI components integrated with the design system
        </p>
      </div>

      {/* Modal Example */}
      <section className={commonClasses.card(isDark)}>
        <h2 className={commonClasses.heading2(isDark)}>Modal</h2>
        <p className={commonClasses.textBody(isDark)}>
          A fully accessible modal dialog with animations.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className={commonClasses.buttonPrimary(isDark)}
        >
          Open Modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          description="This is an example modal using Headless UI"
          size="md"
        >
          <p className={commonClasses.textBody(isDark)}>
            This modal is fully accessible and supports keyboard navigation.
            Press Escape to close or click outside the modal.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className={commonClasses.buttonPrimary(isDark)}
            >
              Close
            </button>
          </div>
        </Modal>
      </section>

      {/* Dropdown Example */}
      <section className={commonClasses.card(isDark)}>
        <h2 className={commonClasses.heading2(isDark)}>Dropdown Menu</h2>
        <p className={commonClasses.textBody(isDark)}>
          A dropdown menu with keyboard navigation support.
        </p>
        <div className="mt-4">
          <Dropdown
            trigger={
              <button className={commonClasses.buttonSecondary(isDark)}>
                <FiMoreVertical className="w-5 h-5" />
                Actions
              </button>
            }
            items={dropdownItems}
            align="left"
          />
        </div>
      </section>

      {/* Tabs Example */}
      <section className={commonClasses.card(isDark)}>
        <h2 className={commonClasses.heading2(isDark)}>Tabs</h2>
        <p className={commonClasses.textBody(isDark)}>
          A tabbed interface component with smooth transitions.
        </p>
        <div className="mt-4">
          <Tabs tabs={tabs} defaultIndex={0} />
        </div>
      </section>

      {/* Disclosure (Accordion) Example */}
      <section className={commonClasses.card(isDark)}>
        <h2 className={commonClasses.heading2(isDark)}>Disclosure (Accordion)</h2>
        <p className={commonClasses.textBody(isDark)}>
          Collapsible content sections with smooth animations.
        </p>
        <div className="mt-4">
          <Disclosure items={disclosureItems} defaultOpen={false} />
        </div>
      </section>

      {/* Popover Example */}
      <section className={commonClasses.card(isDark)}>
        <h2 className={commonClasses.heading2(isDark)}>Popover</h2>
        <p className={commonClasses.textBody(isDark)}>
          A popover component for tooltips and floating content.
        </p>
        <div className="mt-4 flex gap-4">
          <Popover
            trigger={
              <button className={commonClasses.buttonOutline(isDark)}>
                <FiInfo className="w-4 h-4 mr-2" />
                Hover for Info
              </button>
            }
            position="bottom"
          >
            <div className="w-64">
              <h4 className={commonClasses.heading3(isDark)}>Information</h4>
              <p className={commonClasses.textBody(isDark)}>
                This is a popover that appears when you hover over the button.
              </p>
            </div>
          </Popover>

          <Popover
            trigger={
              <button className={commonClasses.buttonOutline(isDark)}>
                <FiHelpCircle className="w-4 h-4 mr-2" />
                Help
              </button>
            }
            position="top"
          >
            <div className="w-64">
              <h4 className={commonClasses.heading3(isDark)}>Help</h4>
              <p className={commonClasses.textBody(isDark)}>
                This popover appears above the button.
              </p>
            </div>
          </Popover>
        </div>
      </section>
    </div>
  );
}

