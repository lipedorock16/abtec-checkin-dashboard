import { User } from "@/contexts/AuthContext";

// Mock users
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@abtec.com",
    role: "admin",
    department: "Management",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@abtec.com",
    role: "user",
    department: "Engineering",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@abtec.com",
    role: "user",
    department: "Human Resources",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=0D8ABC&color=fff",
  },
  {
    id: "4",
    name: "Michael Johnson",
    email: "michael@abtec.com",
    role: "user",
    department: "Marketing",
    avatar: "https://ui-avatars.com/api/?name=Michael+Johnson&background=0D8ABC&color=fff",
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@abtec.com",
    role: "user",
    department: "Finance",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=0D8ABC&color=fff",
  },
];

// Check-in record type
export interface CheckInRecord {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  type: 'in' | 'out' | 'lunch_start' | 'lunch_end';
  timestamp: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Generate mock check-in data for the past week
export const generateMockCheckIns = (): CheckInRecord[] => {
  const records: CheckInRecord[] = [];
  const now = new Date();
  
  // For each user, generate check-ins for the past 7 days
  users.forEach(user => {
    // Skip admin for check-ins
    if (user.role === 'admin') return;
    
    for (let day = 6; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      
      // Only generate records for weekdays (1-5 is Monday-Friday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      
      // Morning check-in (varies between 7:45 and 8:15)
      const checkInHour = 7 + Math.floor(Math.random() * 2);
      const checkInMin = Math.floor(Math.random() * 30) + (checkInHour === 7 ? 45 : 0);
      const checkInTime = `${dateStr}T${checkInHour.toString().padStart(2, '0')}:${checkInMin.toString().padStart(2, '0')}:00`;
      
      records.push({
        id: `${user.id}-${dateStr}-in`,
        userId: user.id,
        userName: user.name,
        userDepartment: user.department,
        type: "in",
        timestamp: checkInTime,
        location: "Escritório Principal",
      });
      
      // Lunch start (around 12:00)
      const lunchStartHour = 12;
      const lunchStartMin = Math.floor(Math.random() * 15);
      const lunchStartTime = `${dateStr}T${lunchStartHour.toString().padStart(2, '0')}:${lunchStartMin.toString().padStart(2, '0')}:00`;
      
      records.push({
        id: `${user.id}-${dateStr}-lunch-start`,
        userId: user.id,
        userName: user.name,
        userDepartment: user.department,
        type: "lunch_start",
        timestamp: lunchStartTime,
        location: "Escritório Principal",
      });
      
      // Lunch end (around 13:00)
      const lunchEndHour = 13;
      const lunchEndMin = Math.floor(Math.random() * 15);
      const lunchEndTime = `${dateStr}T${lunchEndHour.toString().padStart(2, '0')}:${lunchEndMin.toString().padStart(2, '0')}:00`;
      
      records.push({
        id: `${user.id}-${dateStr}-lunch-end`,
        userId: user.id,
        userName: user.name,
        userDepartment: user.department,
        type: "lunch_end",
        timestamp: lunchEndTime,
        location: "Escritório Principal",
      });
      
      // Evening check-out (varies between 17:00 and 18:30)
      const checkOutHour = 17 + Math.floor(Math.random() * 2);
      const checkOutMin = Math.floor(Math.random() * 30);
      const checkOutTime = `${dateStr}T${checkOutHour.toString().padStart(2, '0')}:${checkOutMin.toString().padStart(2, '0')}:00`;
      
      records.push({
        id: `${user.id}-${dateStr}-out`,
        userId: user.id,
        userName: user.name,
        userDepartment: user.department,
        type: "out",
        timestamp: checkOutTime,
        location: "Escritório Principal",
      });
    }
  });
  
  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Helper function to format date/time for display
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleString('pt-BR', options);
};

// Helper to format just the time
export const formatTime = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleString('pt-BR', options);
};

// Helper to get type label
export const getCheckInTypeLabel = (type: string): string => {
  switch (type) {
    case 'in': return 'Entrada';
    case 'out': return 'Saída';
    case 'lunch_start': return 'Início Almoço';
    case 'lunch_end': return 'Fim Almoço';
    default: return type;
  }
};

// Create a function to get type-based colors
export const getCheckInTypeColor = (type: string): string => {
  switch (type) {
    case 'in': return 'text-green-600 bg-green-50';
    case 'out': return 'text-blue-600 bg-blue-50';
    case 'lunch_start': return 'text-orange-600 bg-orange-50';
    case 'lunch_end': return 'text-purple-600 bg-purple-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};
