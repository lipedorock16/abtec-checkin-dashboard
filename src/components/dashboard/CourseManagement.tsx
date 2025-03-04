
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, BookOpen, Plus, BookText } from 'lucide-react';
import { toast } from 'sonner';
import { courses, Course } from '@/utils/mockData';

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    department: '',
    description: '',
    credits: 3
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredCourses(courses);
      return;
    }
    
    const filtered = courses.filter(course => 
      course.name.toLowerCase().includes(term) || 
      course.department.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    );
    
    setFilteredCourses(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddCourse = () => {
    // Validate form
    if (!newCourse.name || !newCourse.department) {
      toast.error('Nome e Departamento são obrigatórios');
      return;
    }
    
    // In a real application, this would save to a database
    toast.success(`Curso "${newCourse.name}" adicionado com sucesso!`);
    setShowAddForm(false);
    setNewCourse({
      name: '',
      department: '',
      description: '',
      credits: 3
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gerenciamento de Cursos</h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie os cursos disponíveis na instituição
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-abtec-600 hover:bg-abtec-700"
        >
          {showAddForm ? (
            <>Cancelar</>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Novo Curso
            </>
          )}
        </Button>
      </div>

      {showAddForm && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Adicionar Novo Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Curso *</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCourse.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Matemática Avançada"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento *</Label>
                <Input
                  id="department"
                  name="department"
                  value={newCourse.department}
                  onChange={handleInputChange}
                  placeholder="Ex: Engenharia"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  placeholder="Descreva o curso brevemente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Créditos</Label>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  max="10"
                  value={newCourse.credits}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddCourse}
                  className="bg-abtec-600 hover:bg-abtec-700"
                >
                  <BookText className="mr-2 h-4 w-4" />
                  Cadastrar Curso
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Lista de Cursos</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 focus-ring w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum curso encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-abtec-600" />
                          <span>{course.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{course.department}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="max-w-xs truncate">
                          {course.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.info(`Editar ${course.name}`)}
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
    </div>
  );
};

export default CourseManagement;
