
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-abtec-600" />
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 bg-abtec-600/10 p-12 items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-bold text-abtec-800 mb-6">
              ABTEC Ponto Eletrônico
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Uma solução moderna e intuitiva para controle de ponto dos seus colaboradores.
              Registre entradas e saídas com facilidade e gerencie horários de forma eficiente.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-abtec-600 font-medium mb-1">Controle de Ponto</div>
                <div className="text-sm text-gray-500">Registre entradas e saídas com facilidade</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-abtec-600 font-medium mb-1">Relatórios</div>
                <div className="text-sm text-gray-500">Visualize e exporte dados de presença</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-abtec-600 font-medium mb-1">Gestão de Usuários</div>
                <div className="text-sm text-gray-500">Gerencie perfis e permissões</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-abtec-600 font-medium mb-1">Notificações</div>
                <div className="text-sm text-gray-500">Mantenha-se informado sobre eventos importantes</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            <LoginForm />
          </motion.div>
        </div>
      </div>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ABTEC Ponto Eletrônico. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Index;
