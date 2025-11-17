import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Route to appropriate dashboard based on userType
    if (user?.userType === 'student') {
      navigate('/dashboard/student', { replace: true });
    } else {
      navigate('/dashboard/customer', { replace: true });
    }
  }, [user, navigate]);

  return null; // This component just redirects
}
