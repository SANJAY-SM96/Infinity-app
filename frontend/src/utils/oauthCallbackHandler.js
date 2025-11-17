/**
 * OAuth Callback Handler Utility
 * Handles Google OAuth callbacks for both login and registration flows
 */

import authService from '../api/authService';
import toast from 'react-hot-toast';

/**
 * Handle OAuth callback from URL parameters
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback when authentication succeeds
 * @param {Function} options.onError - Callback when authentication fails
 * @param {Function} options.navigate - Navigation function from react-router
 * @param {boolean} options.isRegistration - Whether this is a registration flow
 * @returns {Promise<boolean>} - Returns true if callback was handled, false otherwise
 */
export const handleOAuthCallback = async ({
  onSuccess,
  onError,
  navigate,
  isRegistration = false
}) => {
  try {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const callbackUrl = urlParams.get('callback_url');

    // Handle errors first
    if (error) {
      let errorMessage = 'Google authentication failed';
      let helpMessage = '';

      switch (error) {
        case 'redirect_uri_mismatch':
          errorMessage = 'OAuth redirect URI mismatch';
          helpMessage = callbackUrl
            ? `The callback URL "${callbackUrl}" is not registered in Google Cloud Console. Please contact support with this URL.`
            : 'The redirect URI configured in your app does not match Google Cloud Console. Please contact support.';
          break;
        case 'invalid_client':
          errorMessage = 'OAuth client configuration error. Please contact support.';
          break;
        case 'google_oauth_not_configured':
          errorMessage = isRegistration
            ? 'Google OAuth is not configured. Please use email/password registration.'
            : 'Google OAuth is not configured. Please use email/password login.';
          break;
        case 'google_auth_failed':
          errorMessage = 'Google authentication failed. Please try again.';
          break;
        default:
          errorMessage = `Authentication error: ${error}`;
      }

      // Show error toast
      toast.error(errorMessage, { duration: 5000 });
      
      // Show help message if available
      if (helpMessage) {
        setTimeout(() => {
          toast(helpMessage, { duration: 8000, icon: 'ℹ️' });
        }, 1000);
      }

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Call error callback if provided
      if (onError) {
        onError(error, errorMessage, helpMessage);
      }

      return true; // Callback was handled
    }

    // Handle successful authentication
    if (token) {
      try {
        // Store token
        localStorage.setItem('token', token);
        
        // Dispatch storage event to notify AuthContext
        window.dispatchEvent(new Event('storage'));

        // Fetch user profile
        const response = await authService.getCurrentUser();
        
        if (response.data?.user) {
          // Store user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
          const user = response.data.user;
          
          // Dispatch another storage event after user data is stored
          window.dispatchEvent(new Event('storage'));

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          // Show success message
          const successMessage = isRegistration
            ? 'Registration successful!'
            : 'Login successful!';
          toast.success(successMessage);

          // Determine redirect path based on user type
          let redirectPath = '/';
          
          if (user.role === 'admin') {
            redirectPath = '/admin';
          } else if (user.userType === 'student') {
            redirectPath = '/home/student';
          } else if (user.userType === 'customer') {
            redirectPath = '/home/customer';
          }

          // Call success callback if provided
          if (onSuccess) {
            onSuccess(user, redirectPath);
          } else {
            // Default navigation if no callback provided
            if (navigate) {
              navigate(redirectPath);
            }
          }

          return true; // Callback was handled
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        
        // Clean up on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        window.history.replaceState({}, document.title, window.location.pathname);

        const errorMsg = err.response?.data?.message || err.message || 'Failed to complete authentication';
        toast.error(errorMsg);

        if (onError) {
          onError('callback_error', errorMsg);
        }

        return true; // Callback was handled
      }
    }

    // No callback parameters found
    return false;
  } catch (err) {
    console.error('Error handling OAuth callback:', err);
    toast.error('An unexpected error occurred');
    
    if (onError) {
      onError('unexpected_error', err.message);
    }

    return false;
  }
};

/**
 * Check if current URL has OAuth callback parameters
 * @returns {boolean} - True if callback parameters are present
 */
export const hasOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const error = urlParams.get('error');
  return !!(token || error);
};

/**
 * Get OAuth callback parameters from URL
 * @returns {Object} - Object with token, error, and callback_url
 */
export const getOAuthCallbackParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    token: urlParams.get('token'),
    error: urlParams.get('error'),
    callbackUrl: urlParams.get('callback_url'),
    state: urlParams.get('state')
  };
};

/**
 * Clean OAuth callback parameters from URL
 */
export const cleanOAuthCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

