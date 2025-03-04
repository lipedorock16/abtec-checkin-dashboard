import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { users as mockUsers } from '@/utils/mockData';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  password?: string;
  avatar?: string;
  courses?: string[];
}

export interface NewUserData {
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (userData: NewUserData) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    setAllUsers(mockUsers);
    
    const savedUser = localStorage.getItem('abtec_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('abtec_user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem('abtec_users', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      let foundUser = allUsers.find(u => u.email === email);
      
      if (!foundUser) {
        foundUser = mockUsers.find(u => u.email === email);
      }
      
      if (foundUser && (password === '123456' || password === foundUser.password)) {
        setUser(foundUser);
        localStorage.setItem('abtec_user', JSON.stringify(foundUser));
        
        toast.success(`Bem-vindo, ${foundUser.name}!`);
        
        if (foundUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error: any) {
      toast.error(error.message || 'Falha ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D8ABC&color=fff`;
  };

  const addUser = async (userData: NewUserData) => {
    setLoading(true);
    
    try {
      const existingUser = allUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Um usuário com este email já existe');
      }
      
      const newId = (Math.max(...allUsers.map(u => parseInt(u.id)), 0) + 1).toString();
      
      const newUser: User = {
        id: newId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        password: userData.password,
        avatar: generateAvatarUrl(userData.name),
        courses: []
      };
      
      const updatedUsers = [...allUsers, newUser];
      setAllUsers(updatedUsers);
      
      localStorage.setItem('abtec_users', JSON.stringify(updatedUsers));
      
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message || 'Falha ao adicionar usuário');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('abtec_user');
    toast.info('Você saiu do sistema');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      addUser,
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
