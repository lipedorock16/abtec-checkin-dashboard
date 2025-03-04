
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import AdminPanel from '@/components/dashboard/AdminPanel';

const AdminPage = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-abtec-600" />
      </div>
    );
  }

  // Redirect if not logged in or not admin
  if (!user) {
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DashboardLayout>
      <AdminPanel />
    </DashboardLayout>
  );
};

export default AdminPage;
