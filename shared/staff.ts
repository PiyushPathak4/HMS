import { z } from 'zod';

// Staff Types
export const StaffStatusSchema = z.enum(['Active', 'Inactive', 'On Leave', 'In Surgery', 'Off Duty']);
export const ShiftTypeSchema = z.enum(['Day', 'Evening', 'Night', 'Rotating']);

export const CreateStaffSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  license: z.string().optional(),
  experience: z.string().min(1, 'Experience is required'),
  status: StaffStatusSchema.default('Active'),
  shift: ShiftTypeSchema,
  schedule: z.string().min(1, 'Schedule is required'),
  specializations: z.array(z.string()).default([]),
  education: z.string().min(1, 'Education is required'),
  certifications: z.array(z.string()).default([]),
  avatar: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  salary: z.number().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  }).optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }).optional()
});

export const UpdateStaffSchema = CreateStaffSchema.partial().omit({ employeeId: true });

export const StaffQuerySchema = z.object({
  department: z.string().optional(),
  role: z.string().optional(),
  status: StaffStatusSchema.optional(),
  shift: ShiftTypeSchema.optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10')
});

// Doctor Types
export const DoctorStatusSchema = z.enum(['Available', 'In Surgery', 'In Consultation', 'Off Duty', 'On Call']);

export const CreateDoctorSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  medicalLicense: z.string().min(1, 'Medical license is required'),
  experience: z.string().min(1, 'Experience is required'),
  status: DoctorStatusSchema.default('Available'),
  shift: ShiftTypeSchema,
  schedule: z.string().min(1, 'Schedule is required'),
  education: z.string().min(1, 'Education is required'),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default(['English']),
  avatar: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  consultationFee: z.number().optional(),
  bio: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  }).optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }).optional()
});

export const UpdateDoctorSchema = CreateDoctorSchema.partial().omit({ employeeId: true });

export const DoctorQuerySchema = z.object({
  department: z.string().optional(),
  specialization: z.string().optional(),
  status: DoctorStatusSchema.optional(),
  shift: ShiftTypeSchema.optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10')
});

// Response Types
export interface StaffResponse {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  license?: string;
  experience: string;
  status: string;
  shift: string;
  schedule: string;
  specializations: string[];
  education: string;
  certifications: string[];
  avatar?: string;
  rating: number;
  patientsToday: number;
  totalPatients: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorResponse {
  id: string;
  employeeId: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  medicalLicense: string;
  experience: string;
  status: string;
  shift: string;
  schedule: string;
  education: string;
  certifications: string[];
  languages: string[];
  avatar?: string;
  rating: number;
  patientsToday: number;
  totalPatients: number;
  consultationFee?: number;
  bio?: string;
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type CreateStaffRequest = z.infer<typeof CreateStaffSchema>;
export type UpdateStaffRequest = z.infer<typeof UpdateStaffSchema>;
export type StaffQuery = z.infer<typeof StaffQuerySchema>;

export type CreateDoctorRequest = z.infer<typeof CreateDoctorSchema>;
export type UpdateDoctorRequest = z.infer<typeof UpdateDoctorSchema>;
export type DoctorQuery = z.infer<typeof DoctorQuerySchema>;
