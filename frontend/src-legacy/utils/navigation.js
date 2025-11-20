// Dynamic navigation configuration
// This utility generates navigation items based on user authentication and roles

import { FiShoppingBag, FiFileText, FiInfo, FiMail, FiLayout } from 'react-icons/fi';

/**
 * Navigation item structure:
 * {
 *   id: string - unique identifier
 *   to: string - route path
 *   label: string - display label
 *   icon: ReactComponent - optional icon component
 *   requiresAuth: boolean - whether user must be authenticated
 *   requiresRole: string[] - array of allowed roles (admin, student, customer)
 *   requiresUserType: string[] - array of allowed userTypes
 *   visible: function - custom visibility function (optional)
 *   badge: string | number - optional badge to display
 * }
 */

// Base navigation items available to all users
const baseNavItems = [
  {
    id: 'shop',
    to: '/products',
    label: 'Shop',
    icon: FiShoppingBag,
    requiresAuth: false,
  },
  {
    id: 'blog',
    to: '/blog',
    label: 'Blog',
    icon: FiFileText,
    requiresAuth: false,
  },
  {
    id: 'about',
    to: '/about',
    label: 'About',
    icon: FiInfo,
    requiresAuth: false,
  },
  {
    id: 'contact',
    to: '/contact',
    label: 'Contact',
    icon: FiMail,
    requiresAuth: false,
  },
];

// Authenticated-only navigation items
const authenticatedNavItems = [
  // Add authenticated-only nav items here if needed
  // Example:
  // {
  //   id: 'orders',
  //   to: '/orders',
  //   label: 'My Orders',
  //   requiresAuth: true,
  // }
];

// Role-specific navigation items
const roleBasedNavItems = [
  {
    id: 'admin',
    to: '/admin',
    label: 'Admin',
    icon: FiLayout,
    requiresAuth: true,
    requiresRole: ['admin'],
  },
];

/**
 * Filters navigation items based on user authentication and role
 * @param {Object} user - Current user object
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {Array} Filtered navigation items
 */
export const getNavigationItems = (user = null, isAuthenticated = false) => {
  const allItems = [...baseNavItems, ...authenticatedNavItems, ...roleBasedNavItems];

  return allItems.filter((item) => {
    // Check authentication requirement
    if (item.requiresAuth && !isAuthenticated) {
      return false;
    }

    // Check role requirement
    if (item.requiresRole && isAuthenticated) {
      const userRole = user?.role;
      if (!item.requiresRole.includes(userRole)) {
        return false;
      }
    }

    // Check userType requirement
    if (item.requiresUserType && isAuthenticated) {
      const userType = user?.userType;
      if (!item.requiresUserType.includes(userType)) {
        return false;
      }
    }

    // Check custom visibility function
    if (item.visible && typeof item.visible === 'function') {
      return item.visible(user, isAuthenticated);
    }

    return true;
  });
};

/**
 * Gets mobile navigation items (can be different from desktop)
 * @param {Object} user - Current user object
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {Array} Filtered navigation items for mobile
 */
export const getMobileNavigationItems = (user = null, isAuthenticated = false) => {
  // Mobile nav can exclude certain items or have a different order
  // For now, return the same items but can be customized
  return getNavigationItems(user, isAuthenticated);
};

/**
 * Home page section navigation items (for sticky nav on home page)
 * These are for scrolling to sections within the home page
 */
const homeSectionNavItems = [
  {
    id: 'home',
    label: 'Home',
    icon: null, // Will be set when imported
    sectionId: 'home',
    scrollTo: true,
    requiresAuth: false,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: null,
    sectionId: 'projects',
    scrollTo: true,
    requiresAuth: false,
  },
  {
    id: 'repositories',
    label: 'Repos',
    icon: null,
    sectionId: 'repositories',
    scrollTo: true,
    requiresAuth: false,
  },
  {
    id: 'shops',
    label: 'Shops',
    icon: null,
    sectionId: 'shops',
    scrollTo: true,
    requiresAuth: false,
  },
  {
    id: 'tech',
    label: 'Tech',
    icon: null,
    sectionId: 'tech',
    scrollTo: true,
    requiresAuth: false,
  },
  {
    id: 'metrics',
    label: 'Stats',
    icon: null,
    sectionId: 'metrics',
    scrollTo: true,
    requiresAuth: false,
  },
  {
    id: 'cta',
    label: 'Get Started',
    icon: null,
    sectionId: 'cta',
    scrollTo: true,
    requiresAuth: false,
  },
];

/**
 * Gets home page section navigation items
 * @param {Object} user - Current user object
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {Object} iconMap - Map of icon IDs to icon components
 * @returns {Array} Filtered home section navigation items
 */
export const getHomeSectionNavItems = (user = null, isAuthenticated = false, iconMap = {}) => {
  return homeSectionNavItems
    .filter((item) => {
      // Check authentication requirement
      if (item.requiresAuth && !isAuthenticated) {
        return false;
      }

      // Check role requirement
      if (item.requiresRole && isAuthenticated) {
        const userRole = user?.role;
        if (!item.requiresRole.includes(userRole)) {
          return false;
        }
      }

      // Check userType requirement
      if (item.requiresUserType && isAuthenticated) {
        const userType = user?.userType;
        if (!item.requiresUserType.includes(userType)) {
          return false;
        }
      }

      // Check custom visibility function
      if (item.visible && typeof item.visible === 'function') {
        return item.visible(user, isAuthenticated);
      }

      return true;
    })
    .map((item) => ({
      ...item,
      icon: iconMap[item.id] || item.icon,
    }));
};

/**
 * Adds a home section navigation item
 * @param {Object} item - Navigation item to add
 */
export const addHomeSectionNavItem = (item) => {
  if (!item.id || !item.label || !item.sectionId) {
    console.error('Home section nav item must have id, label, and sectionId properties');
    return;
  }
  homeSectionNavItems.push({ ...item, scrollTo: true });
};

/**
 * Updates a home section navigation item by id
 * @param {string} id - Navigation item id to update
 * @param {Object} updates - Properties to update
 */
export const updateHomeSectionNavItem = (id, updates) => {
  const item = homeSectionNavItems.find((i) => i.id === id);
  if (item) {
    Object.assign(item, updates);
  } else {
    console.warn(`Home section nav item with id "${id}" not found`);
  }
};

/**
 * Removes a home section navigation item by id
 * @param {string} id - Navigation item id to remove
 */
export const removeHomeSectionNavItem = (id) => {
  const index = homeSectionNavItems.findIndex((item) => item.id === id);
  if (index > -1) {
    homeSectionNavItems.splice(index, 1);
  }
};

/**
 * Adds a custom navigation item (useful for plugins/extensions)
 * @param {Object} item - Navigation item to add
 */
export const addNavigationItem = (item) => {
  if (!item.id || !item.to || !item.label) {
    console.error('Navigation item must have id, to, and label properties');
    return;
  }
  baseNavItems.push(item);
};

/**
 * Removes a navigation item by id
 * @param {string} id - Navigation item id to remove
 */
export const removeNavigationItem = (id) => {
  const index = baseNavItems.findIndex((item) => item.id === id);
  if (index > -1) {
    baseNavItems.splice(index, 1);
  }

  const authIndex = authenticatedNavItems.findIndex((item) => item.id === id);
  if (authIndex > -1) {
    authenticatedNavItems.splice(authIndex, 1);
  }

  const roleIndex = roleBasedNavItems.findIndex((item) => item.id === id);
  if (roleIndex > -1) {
    roleBasedNavItems.splice(roleIndex, 1);
  }
};

/**
 * Updates a navigation item by id
 * @param {string} id - Navigation item id to update
 * @param {Object} updates - Properties to update
 */
export const updateNavigationItem = (id, updates) => {
  const allItems = [...baseNavItems, ...authenticatedNavItems, ...roleBasedNavItems];
  const item = allItems.find((i) => i.id === id);
  
  if (item) {
    Object.assign(item, updates);
  } else {
    console.warn(`Navigation item with id "${id}" not found`);
  }
};

// Export default configuration
export default {
  getNavigationItems,
  getMobileNavigationItems,
  addNavigationItem,
  removeNavigationItem,
  updateNavigationItem,
};

