
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Bell, Edit, Lock, Mail, Save, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const SettingsPage = () => {
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

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e informações de conta.
          </p>
        </div>

        <Tabs defaultValue="profile" className="animate-scale-in">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações de perfil.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button size="sm" variant="outline" className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Alterar Foto
                      </Button>
                    </div>
                  </div>

                  <form className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={user.email} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="department">Departamento</Label>
                      <Input id="department" defaultValue={user.department} disabled />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleSave}
                      className="mt-2 bg-abtec-600 hover:bg-abtec-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Conta</CardTitle>
                  <CardDescription>
                    Altere como sua conta funciona no sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme">Tema Escuro</Label>
                      <p className="text-sm text-muted-foreground">
                        Altere para o modo escuro.
                      </p>
                    </div>
                    <Switch id="theme" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="language">Idioma</Label>
                      <p className="text-sm text-muted-foreground">
                        Escolha o idioma da interface.
                      </p>
                    </div>
                    <div className="w-[180px]">
                      <select 
                        id="language" 
                        className="w-full rounded-md border border-input px-3 py-2 bg-transparent"
                        defaultValue="pt-BR"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <p className="text-sm text-muted-foreground">
                        Defina seu fuso horário.
                      </p>
                    </div>
                    <div className="w-[180px]">
                      <select 
                        id="timezone" 
                        className="w-full rounded-md border border-input px-3 py-2 bg-transparent"
                        defaultValue="America/Sao_Paulo"
                      >
                        <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                        <option value="America/Manaus">Manaus (GMT-4)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Atualize suas credenciais de segurança.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-3">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start mt-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium">Importante sobre senhas</p>
                      <p className="mt-1">Utilize uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => toast.success('Senha alterada com sucesso!')}
                    className="mt-2 bg-abtec-600 hover:bg-abtec-700"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Atualizar Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Notificações por Email</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Resumo Diário</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba um resumo diário dos seus registros de ponto.
                        </p>
                      </div>
                      <Switch id="email-daily" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas de Irregularidade</Label>
                        <p className="text-sm text-muted-foreground">
                          Seja notificado quando houver registros fora do padrão.
                        </p>
                      </div>
                      <Switch id="email-alerts" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Notificações do Sistema</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Lembretes de Ponto</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba lembretes para registrar seu ponto.
                        </p>
                      </div>
                      <Switch id="system-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Atualizações do Sistema</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações sobre atualizações do sistema.
                        </p>
                      </div>
                      <Switch id="system-updates" />
                    </div>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={handleSave}
                  className="mt-2 bg-abtec-600 hover:bg-abtec-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
