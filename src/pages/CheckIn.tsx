
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import CheckInSystem from '@/components/dashboard/CheckInSystem';

const CheckInPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-abtec-600" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registro de Ponto</h1>
          <p className="text-muted-foreground">
            Registre suas entradas e saídas no sistema de ponto eletrônico.
          </p>
        </div>

        <CheckInSystem />
      </div>
    </DashboardLayout>
  );
};

export default CheckInPage;
