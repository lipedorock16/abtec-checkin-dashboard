
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import Logo from '@/components/logo/Logo';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the auth context
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 650);
    }
  };

  return (
    <Card className={`w-full max-w-md glass border-0 shadow-lg animate-scale-in ${
      isAnimating ? 'animate-[shake_0.65s_cubic-bezier(0.36,0.07,0.19,0.97)_both]' : ''
    }`}>
      <CardHeader className="space-y-2 text-center pt-8">
        <div className="mx-auto">
          <Logo withTagline className="mb-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-center">Acesso ao Sistema</h2>
        <p className="text-sm text-muted-foreground">
          Entre com suas credenciais para acessar
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 focus-ring"
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                placeholder="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 focus-ring"
                autoComplete="current-password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 mt-6 bg-abtec-600 hover:bg-abtec-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground pb-8">
        <p>Para fins de demonstração use: admin@abtec.com / 123456</p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
