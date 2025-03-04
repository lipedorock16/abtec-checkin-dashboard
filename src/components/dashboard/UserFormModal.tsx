
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

const userFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  department: z.string().min(2, { message: 'Departamento é obrigatório' }),
  role: z.enum(['admin', 'user']),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose }) => {
  const { addUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      department: '',
      role: 'user',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      await addUser(data);
      toast.success('Usuário adicionado com sucesso!');
      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar usuário');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Adicionar Novo Usuário
            <Button variant="ghost" size="icon" className="ml-auto" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nome do usuário"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="email@exemplo.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha temporária</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register('password')}
                placeholder="Senha temporária"
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                onClick={togglePasswordVisibility}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Esta senha será usada no primeiro acesso do usuário
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              {...form.register('department')}
              placeholder="Ex: Matemática, Informática, etc."
            />
            {form.formState.errors.department && (
              <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Perfil</Label>
            <Select 
              defaultValue={form.getValues('role')} 
              onValueChange={(value) => form.setValue('role', value as 'admin' | 'user')}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Professor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-abtec-600 hover:bg-abtec-700">
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormModal;
