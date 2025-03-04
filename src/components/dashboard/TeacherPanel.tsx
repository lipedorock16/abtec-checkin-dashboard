
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, BookOpen, Calendar } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  getUserSchedules, 
  formatTimeRange, 
  getDayOfWeekColor,
  TeachingSchedule 
} from '@/utils/mockData';

const TeacherPanel = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const schedules = getUserSchedules(user.id);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Meus Horários de Aula</h2>
        <p className="text-muted-foreground">
          Confira sua programação de aulas para a semana
        </p>
      </div>
      
      {schedules.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center h-40">
              <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium">Nenhum horário programado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Você não possui horários de aula cadastrados no momento
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-abtec-600 mr-2" />
                  <div className="text-2xl font-bold">{schedules.length}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carga Horária Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-abtec-600 mr-2" />
                  <div className="text-2xl font-bold">
                    {schedules.reduce((total, schedule) => {
                      const start = new Date(`2022-01-01T${schedule.startTime}:00`);
                      const end = new Date(`2022-01-01T${schedule.endTime}:00`);
                      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      return total + hours;
                    }, 0)}h
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cronograma Semanal</CardTitle>
              <CardDescription>
                Seus horários de aula durante a semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dia</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Local</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sort schedules by day of week and start time */}
                    {schedules
                      .slice()
                      .sort((a, b) => {
                        const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
                        const dayDiff = days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                        return dayDiff !== 0 ? dayDiff : a.startTime.localeCompare(b.startTime);
                      })
                      .map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${getDayOfWeekColor(schedule.dayOfWeek)} font-medium`}
                            >
                              {schedule.dayOfWeek}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{schedule.courseName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                              <span>{formatTimeRange(schedule.startTime, schedule.endTime)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                              <span>{schedule.location}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Visão por Dia</CardTitle>
              <CardDescription>
                Detalhamento das aulas agrupadas por dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(day => {
                  const daySchedules = schedules.filter(s => s.dayOfWeek === day);
                  if (daySchedules.length === 0) return null;
                  
                  return (
                    <div key={day} className="space-y-3">
                      <h3 className="font-semibold flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`${getDayOfWeekColor(day)} mr-2`}
                        >
                          {day}
                        </Badge>
                        {daySchedules.length} aula(s)
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {daySchedules.map(schedule => (
                          <Card key={schedule.id} className="border shadow-sm">
                            <CardContent className="p-4">
                              <div className="font-medium text-lg">{schedule.courseName}</div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{formatTimeRange(schedule.startTime, schedule.endTime)}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{schedule.location}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TeacherPanel;
