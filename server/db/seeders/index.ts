import { connectToDatabase, disconnectFromDatabase } from '../connection';
import { Staff } from '../models/Staff';
import { Doctor } from '../models/Doctor';

const staffSeedData = [
  {
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
    totalPatients: 2847
  },
  {
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
    totalPatients: 3124
  },
  {
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
    totalPatients: 1567
  },
  {
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
    totalPatients: 1834
  },
  {
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
    totalPatients: 892
  }
];

const doctorSeedData = [
  {
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
    achievements: ['Best Doctor Award 2023', 'Research Excellence Award', '500+ Successful Cardiac Procedures']
  },
  {
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
    achievements: ['Excellence in Patient Care', 'Medical Education Leadership Award']
  },
  {
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
    achievements: ['Top Surgeon Award', 'Innovation in Orthopedic Surgery', '1000+ Successful Joint Replacements']
  },
  {
    employeeId: 'DOC004',
    name: 'Mark Davis',
    specialization: 'Emergency Medicine',
    department: 'Emergency',
    phone: '+1 (555) 567-8901',
    email: 'mark.davis.md@medicare.com',
    medicalLicense: 'MD789123456',
    experience: '8 years',
    status: 'On Call',
    shift: 'Night',
    schedule: 'Mon-Wed-Fri 6PM-6AM',
    education: 'MD - University of Michigan',
    certifications: ['Emergency Medicine Board Certified', 'ATLS', 'ACLS', 'BLS'],
    languages: ['English', 'German'],
    rating: 4.6,
    patientsToday: 22,
    totalPatients: 1456,
    consultationFee: 180,
    bio: 'Dr. Mark Davis is an emergency medicine specialist with expertise in trauma care and critical care medicine.',
    achievements: ['Emergency Response Excellence', 'Life Saver Award']
  },
  {
    employeeId: 'DOC005',
    name: 'Jennifer Taylor',
    specialization: 'Family Medicine',
    department: 'General Practice',
    phone: '+1 (555) 345-6789',
    email: 'jennifer.taylor.md@medicare.com',
    medicalLicense: 'MD654321987',
    experience: '6 years',
    status: 'Available',
    shift: 'Day',
    schedule: 'Mon-Fri 9AM-5PM',
    education: 'MD - University of California San Francisco',
    certifications: ['Family Medicine Board Certified', 'BLS'],
    languages: ['English', 'Spanish', 'Portuguese'],
    rating: 4.8,
    patientsToday: 18,
    totalPatients: 2156,
    consultationFee: 150,
    bio: 'Dr. Jennifer Taylor provides comprehensive family medicine care with a focus on preventive healthcare and wellness.',
    achievements: ['Patient Choice Award', 'Community Service Excellence']
  }
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectToDatabase();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Staff.deleteMany({});
    await Doctor.deleteMany({});
    
    // Seed staff data
    console.log('👥 Seeding staff data...');
    await Staff.insertMany(staffSeedData);
    console.log(`✅ Inserted ${staffSeedData.length} staff members`);
    
    // Seed doctor data
    console.log('👨‍⚕️ Seeding doctor data...');
    await Doctor.insertMany(doctorSeedData);
    console.log(`✅ Inserted ${doctorSeedData.length} doctors`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Print summary
    const staffCount = await Staff.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`- Staff Members: ${staffCount}`);
    console.log(`- Doctors: ${doctorCount}`);
    console.log(`- Total: ${staffCount + doctorCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
