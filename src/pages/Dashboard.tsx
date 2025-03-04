
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersList from '@/components/dashboard/UsersList';
import { CalendarDays, Clock, LineChart, User } from 'lucide-react';

const Dashboard = () => {
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

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao ABTEC Ponto Eletrônico, {user.name.split(' ')[0]}.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-slide-up animation-delay-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Horário Atual</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCurrentTime()}</div>
              <p className="text-xs text-muted-foreground mt-1">{getCurrentDate()}</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departamento</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.department}</div>
              <p className="text-xs text-muted-foreground mt-1">Sua área de atuação</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up animation-delay-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Horas Trabalhadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38h 15m</div>
              <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up animation-delay-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Próximo Feriado</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/11</div>
              <p className="text-xs text-muted-foreground mt-1">Proclamação da República</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="animate-scale-in animation-delay-300">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics" disabled>Análises</TabsTrigger>
            <TabsTrigger value="reports" disabled>Relatórios</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resumo de Atividade</CardTitle>
                    <CardDescription>Visão geral das suas horas registradas</CardDescription>
                  </div>
                  <LineChart className="h-5 w-5 text-abtec-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-gray-50">
                  <div className="text-center text-muted-foreground">
                    <p>Gráfico de horas trabalhadas por dia</p>
                    <p className="text-sm">(Dados de demonstração)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <UsersList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
