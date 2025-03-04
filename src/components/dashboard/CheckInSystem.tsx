
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckInRecord, formatDate, generateMockCheckIns, getCheckInTypeLabel, getCheckInTypeColor } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, LocateFixed, LogIn, LogOut, PanelRightClose, Users, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

type CheckInType = 'in' | 'out' | 'lunch_start' | 'lunch_end';

const CheckInSystem = () => {
  const { user } = useAuth();
  const [userCheckIns, setUserCheckIns] = useState<CheckInRecord[]>([]);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInRecord | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInType, setCheckInType] = useState<CheckInType>('in');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Load mock check-in data for the current user
    if (user) {
      const allCheckIns = generateMockCheckIns();
      const userRecords = allCheckIns.filter(record => record.userId === user.id);
      
      setUserCheckIns(userRecords.slice(0, 20)); // Limit to 20 records
      
      // Find the last check-in for today
      const today = new Date().toISOString().split('T')[0];
      const todayCheckIns = userRecords.filter(record => record.timestamp.startsWith(today));
      
      if (todayCheckIns.length > 0) {
        // Sort by timestamp in descending order and get the most recent
        todayCheckIns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLastCheckIn(todayCheckIns[0]);
        
        // Set the next logical check-in type based on the last one
        if (todayCheckIns[0].type === 'in') {
          setCheckInType('lunch_start');
        } else if (todayCheckIns[0].type === 'lunch_start') {
          setCheckInType('lunch_end');
        } else if (todayCheckIns[0].type === 'lunch_end') {
          setCheckInType('out');
        } else {
          setCheckInType('in');
        }
      } else {
        setCheckInType('in');
      }
    }
    
    return () => clearInterval(timer);
  }, [user]);

  const handleCheckIn = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date();
      const newCheckIn: CheckInRecord = {
        id: `${user.id}-${now.toISOString()}`,
        userId: user.id,
        userName: user.name,
        userDepartment: user.department,
        type: checkInType,
        timestamp: now.toISOString(),
        location: 'Escritório Principal',
      };
      
      // Add the new check-in to the list
      setUserCheckIns(prev => [newCheckIn, ...prev]);
      setLastCheckIn(newCheckIn);
      
      // Update the next logical check-in type
      if (checkInType === 'in') {
        setCheckInType('lunch_start');
      } else if (checkInType === 'lunch_start') {
        setCheckInType('lunch_end');
      } else if (checkInType === 'lunch_end') {
        setCheckInType('out');
      } else {
        setCheckInType('in');
      }
      
      const messages = {
        in: 'Entrada registrada com sucesso!',
        out: 'Saída registrada com sucesso!',
        lunch_start: 'Início do almoço registrado!',
        lunch_end: 'Fim do almoço registrado!'
      };
      
      toast.success(messages[checkInType], {
        description: `Horário: ${now.toLocaleTimeString('pt-BR')}`,
      });
    } catch (error) {
      toast.error('Erro ao registrar ponto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = () => {
    switch (checkInType) {
      case 'in': return 'Registrar Entrada';
      case 'out': return 'Registrar Saída';
      case 'lunch_start': return 'Iniciar Almoço';
      case 'lunch_end': return 'Finalizar Almoço';
    }
  };

  const getButtonIcon = () => {
    switch (checkInType) {
      case 'in': return <LogIn className="mr-2 h-4 w-4" />;
      case 'out': return <LogOut className="mr-2 h-4 w-4" />;
      case 'lunch_start': return <Utensils className="mr-2 h-4 w-4" />;
      case 'lunch_end': return <CheckCircle className="mr-2 h-4 w-4" />;
    }
  };

  const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Status Card */}
      <Card className="col-span-3 md:col-span-1 animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg">Status Atual</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: '2-digit', 
              month: 'long' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-abtec-50 flex items-center justify-center">
                  <Clock className="h-16 w-16 text-abtec-600 animate-pulse-soft" />
                </div>
                {lastCheckIn && (
                  <Badge 
                    className={`absolute -right-2 -top-2 px-3 py-1 ${getCheckInTypeColor(lastCheckIn.type)}`}
                  >
                    {getCheckInTypeLabel(lastCheckIn.type)}
                  </Badge>
                )}
              </div>
              <span className="mt-4 text-4xl font-bold">{getFormattedTime(currentTime)}</span>
              <span className="text-sm text-muted-foreground mt-1">
                {getFormattedDate(currentTime)}
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Último Registro:</h3>
            {lastCheckIn ? (
              <div className="text-sm">
                <Badge 
                  variant="outline" 
                  className={`mb-2 ${getCheckInTypeColor(lastCheckIn.type)}`}
                >
                  {getCheckInTypeLabel(lastCheckIn.type)}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(lastCheckIn.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <LocateFixed className="h-4 w-4" />
                  <span>{lastCheckIn.location}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum registro hoje.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            className="w-full mt-4 bg-abtec-600 hover:bg-abtec-700"
            onClick={handleCheckIn} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processando...
              </>
            ) : (
              <>
                {getButtonIcon()}
                {getButtonLabel()}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* History Tabs */}
      <Card className="col-span-3 md:col-span-2 animate-slide-up animation-delay-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Histórico de Registros</CardTitle>
              <CardDescription>Visualize seus registros de ponto</CardDescription>
            </div>
            <PanelRightClose className="h-5 w-5 text-abtec-600" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList className="mb-4">
              <TabsTrigger value="personal" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Meus Registros</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-1" disabled>
                <Users className="h-4 w-4" />
                <span>Todos</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {userCheckIns.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhum registro encontrado.
                  </div>
                ) : (
                  userCheckIns.map((record, index) => (
                    <React.Fragment key={record.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge 
                            variant="outline" 
                            className={getCheckInTypeColor(record.type)}
                          >
                            {getCheckInTypeLabel(record.type)}
                          </Badge>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {formatDate(record.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <div>{record.location}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ID: {record.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                      {index < userCheckIns.length - 1 && <Separator className="my-4" />}
                    </React.Fragment>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInSystem;
