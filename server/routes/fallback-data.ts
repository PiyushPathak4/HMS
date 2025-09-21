// Fallback data when MongoDB is not available
export const fallbackStaffData = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Dr. Emily Smith',
    role: 'Cardiologist',
    department: 'Cardiology',
    phone: '+1 (555) 123-4567',
    email: 'emily.smith@medicare.com',
    license: 'MD123456',
    experience: '12 years',
    status: 'Active',
    shift: 'Day',
    schedule: 'Mon-Fri 8AM-6PM',
    specializations: ['Interventional Cardiology', 'Heart Failure'],
    education: 'MD - Harvard Medical School',
    certifications: ['Board Certified Cardiologist', 'ACLS', 'BLS'],
    rating: 4.9,
    patientsToday: 12,
    totalPatients: 2847,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Dr. Robert Wilson',
    role: 'Internal Medicine',
    department: 'Internal Medicine',
    phone: '+1 (555) 987-6543',
    email: 'robert.wilson@medicare.com',
    license: 'MD789012',
    experience: '15 years',
    status: 'Active',
    shift: 'Day',
    schedule: 'Mon-Fri 7AM-5PM',
    specializations: ['Diabetes Management', 'Hypertension'],
    education: 'MD - Johns Hopkins University',
    certifications: ['Internal Medicine Board Certified', 'ACLS', 'BLS'],
    rating: 4.8,
    patientsToday: 15,
    totalPatients: 3124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Sarah Johnson',
    role: 'Registered Nurse',
    department: 'Emergency',
    phone: '+1 (555) 456-7890',
    email: 'sarah.johnson@medicare.com',
    license: 'RN345678',
    experience: '8 years',
    status: 'Active',
    shift: 'Night',
    schedule: 'Mon-Wed-Fri 6PM-6AM',
    specializations: ['Emergency Care', 'Trauma Nursing'],
    education: 'BSN - University of California',
    certifications: ['CCRN', 'ACLS', 'BLS', 'PALS'],
    rating: 4.9,
    patientsToday: 0,
    totalPatients: 1567,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Dr. Lisa Brown',
    role: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    phone: '+1 (555) 234-5678',
    email: 'lisa.brown@medicare.com',
    license: 'MD456789',
    experience: '10 years',
    status: 'In Surgery',
    shift: 'Day',
    schedule: 'Tue-Thu-Sat 8AM-8PM',
    specializations: ['Joint Replacement', 'Sports Medicine'],
    education: 'MD - Stanford University',
    certifications: ['Orthopedic Surgery Board Certified', 'ACLS', 'BLS'],
    rating: 4.7,
    patientsToday: 6,
    totalPatients: 1834,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'Mike Thompson',
    role: 'Radiology Technician',
    department: 'Radiology',
    phone: '+1 (555) 345-6789',
    email: 'mike.thompson@medicare.com',
    license: 'RT123456',
    experience: '6 years',
    status: 'Active',
    shift: 'Day',
    schedule: 'Mon-Fri 9AM-5PM',
    specializations: ['CT Imaging', 'MRI', 'X-Ray'],
    education: 'Associates - Community College',
    certifications: ['ARRT Certified', 'CT Certified', 'MRI Certified'],
    rating: 4.6,
    patientsToday: 28,
    totalPatients: 892,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const fallbackDoctorData = [
  {
    id: '1',
    employeeId: 'DOC001',
    name: 'Emily Smith',
    specialization: 'Cardiology',
    department: 'Cardiology',
    phone: '+1 (555) 123-4567',
    email: 'emily.smith.md@medicare.com',
    medicalLicense: 'MD123456789',
    experience: '12 years',
    status: 'Available',
    shift: 'Day',
    schedule: 'Mon-Fri 8AM-6PM',
    education: 'MD - Harvard Medical School',
    certifications: ['Board Certified Cardiologist', 'ACLS', 'BLS'],
    languages: ['English', 'Spanish'],
    rating: 4.9,
    patientsToday: 12,
    totalPatients: 2847,
    consultationFee: 250,
    bio: 'Dr. Emily Smith is a highly experienced cardiologist specializing in interventional cardiology and heart failure management.',
    achievements: ['Best Doctor Award 2023', 'Research Excellence Award', '500+ Successful Cardiac Procedures'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    employeeId: 'DOC002',
    name: 'Robert Wilson',
    specialization: 'Internal Medicine',
    department: 'Internal Medicine',
    phone: '+1 (555) 987-6543',
    email: 'robert.wilson.md@medicare.com',
    medicalLicense: 'MD987654321',
    experience: '15 years',
    status: 'Available',
    shift: 'Day',
    schedule: 'Mon-Fri 7AM-5PM',
    education: 'MD - Johns Hopkins University',
    certifications: ['Internal Medicine Board Certified', 'ACLS', 'BLS'],
    languages: ['English'],
    rating: 4.8,
    patientsToday: 15,
    totalPatients: 3124,
    consultationFee: 200,
    bio: 'Dr. Robert Wilson is an expert in internal medicine with extensive experience in diabetes management and hypertension.',
    achievements: ['Excellence in Patient Care', 'Medical Education Leadership Award'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    employeeId: 'DOC003',
    name: 'Lisa Brown',
    specialization: 'Orthopedic Surgery',
    department: 'Orthopedics',
    phone: '+1 (555) 234-5678',
    email: 'lisa.brown.md@medicare.com',
    medicalLicense: 'MD456789123',
    experience: '10 years',
    status: 'In Surgery',
    shift: 'Day',
    schedule: 'Tue-Thu-Sat 8AM-8PM',
    education: 'MD - Stanford University',
    certifications: ['Orthopedic Surgery Board Certified', 'ACLS', 'BLS'],
    languages: ['English', 'French'],
    rating: 4.7,
    patientsToday: 6,
    totalPatients: 1834,
    consultationFee: 300,
    bio: 'Dr. Lisa Brown specializes in joint replacement and sports medicine with a focus on minimally invasive techniques.',
    achievements: ['Top Surgeon Award', 'Innovation in Orthopedic Surgery', '1000+ Successful Joint Replacements'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let staffMemory = [...fallbackStaffData];
let doctorMemory = [...fallbackDoctorData];

export const inMemoryStorage = {
  staff: {
    getAll: () => staffMemory,
    getById: (id: string) => staffMemory.find(s => s.id === id),
    create: (data: any) => {
      const newStaff = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      staffMemory.push(newStaff);
      return newStaff;
    },
    update: (id: string, data: any) => {
      const index = staffMemory.findIndex(s => s.id === id);
      if (index !== -1) {
        staffMemory[index] = { ...staffMemory[index], ...data, updatedAt: new Date().toISOString() };
        return staffMemory[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = staffMemory.findIndex(s => s.id === id);
      if (index !== -1) {
        staffMemory.splice(index, 1);
        return true;
      }
      return false;
    },
    getDepartments: () => [...new Set(staffMemory.map(s => s.department))],
    getRoles: () => [...new Set(staffMemory.map(s => s.role))]
  },
  doctors: {
    getAll: () => doctorMemory,
    getById: (id: string) => doctorMemory.find(d => d.id === id),
    create: (data: any) => {
      const newDoctor = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      doctorMemory.push(newDoctor);
      return newDoctor;
    },
    update: (id: string, data: any) => {
      const index = doctorMemory.findIndex(d => d.id === id);
      if (index !== -1) {
        doctorMemory[index] = { ...doctorMemory[index], ...data, updatedAt: new Date().toISOString() };
        return doctorMemory[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = doctorMemory.findIndex(d => d.id === id);
      if (index !== -1) {
        doctorMemory.splice(index, 1);
        return true;
      }
      return false;
    },
    getSpecializations: () => [...new Set(doctorMemory.map(d => d.specialization))],
    getDepartments: () => [...new Set(doctorMemory.map(d => d.department))]
  }
};
