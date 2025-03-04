
import React, { useState } from 'react';
import { users } from '@/utils/mockData';
import { User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import CourseManagement from './CourseManagement';

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term)
    );
    
    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    toast.info('Funcionalidade de adicionar usuário será implementada em breve.');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários e cursos do sistema ABTEC Ponto Eletrônico.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="animate-slide-up animation-delay-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-abtec-600 mr-2" />
              <div className="text-2xl font-bold">{users.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up animation-delay-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-abtec-600 mr-2" />
              <div className="text-2xl font-bold">
                {users.filter(user => user.role === 'admin').length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up animation-delay-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Professores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-abtec-600 mr-2" />
              <div className="text-2xl font-bold">
                {users.filter(user => user.role === 'user').length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="animate-scale-in animation-delay-400">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="h-4 w-4 mr-2" />
            Cursos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Lista de Usuários</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou departamento..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 focus-ring"
                  />
                </div>
                <Button 
                  onClick={handleAddUser}
                  className="bg-abtec-600 hover:bg-abtec-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role === 'admin' ? 'Administrador' : 'Professor'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toast.info(`Editar ${user.name}`)}
                              className="h-8 px-2 lg:px-3"
                            >
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
