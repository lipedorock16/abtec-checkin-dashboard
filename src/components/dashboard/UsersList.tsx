
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckInRecord, generateMockCheckIns, formatDate, getCheckInTypeLabel, getCheckInTypeColor } from '@/utils/mockData';
import { Activity, Clock, UserCheck } from 'lucide-react';

const UsersList = () => {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<CheckInRecord[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    // Generate mock check-in data
    const records = generateMockCheckIns();
    setCheckIns(records);
    
    // Filter today's check-ins
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(record => 
      record.timestamp.startsWith(today)
    );
    setTodayCheckIns(todayRecords);
    
    // Calculate active users (who checked in but didn't check out today)
    const userCheckInStatus = new Map<string, boolean>();
    
    todayRecords.forEach(record => {
      if (record.type === 'in') {
        userCheckInStatus.set(record.userId, true);
      } 
      else if (record.type === 'out') {
        userCheckInStatus.set(record.userId, false);
      }
    });
    
    const currentlyActive = [...userCheckInStatus.entries()]
      .filter(([_, isActive]) => isActive)
      .map(([userId]) => userId);
    
    setActiveUsers(currentlyActive);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuários Ativos</CardTitle>
              <CardDescription>Usuários que registraram entrada hoje</CardDescription>
            </div>
            <UserCheck className="h-5 w-5 text-abtec-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeUsers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum usuário ativo no momento.
              </div>
            ) : (
              activeUsers.map(userId => {
                const record = todayCheckIns.find(r => r.userId === userId && r.type === 'in');
                if (!record) return null;
                
                return (
                  <div key={userId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${record.userName.replace(' ', '+')}&background=0D8ABC&color=fff`} />
                          <AvatarFallback>{getInitials(record.userName)}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                      </div>
                      <div>
                        <p className="font-medium leading-none">{record.userName}</p>
                        <p className="text-sm text-muted-foreground">{record.userDepartment}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm leading-none">Entrada às:</div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(record.timestamp).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </time>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up animation-delay-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimos registros de ponto</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-abtec-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checkIns.slice(0, 5).map(record => (
              <div key={record.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${record.userName.replace(' ', '+')}&background=0D8ABC&color=fff`} />
                    <AvatarFallback>{getInitials(record.userName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium leading-none text-sm">{record.userName}</p>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0 ${getCheckInTypeColor(record.type)}`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {getCheckInTypeLabel(record.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <time className="text-xs text-muted-foreground">
                  {formatDate(record.timestamp)}
                </time>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersList;
