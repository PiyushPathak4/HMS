// MongoDB initialization script for Docker
// This script creates the database and initial collections

// Switch to the medicare-plus database
db = db.getSiblingDB('medicare-plus');

// Create collections with validation
db.createCollection('staff', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['employeeId', 'name', 'role', 'department', 'phone', 'email'],
      properties: {
        employeeId: { bsonType: 'string' },
        name: { bsonType: 'string' },
        role: { bsonType: 'string' },
        department: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        email: { bsonType: 'string' },
        status: { 
          enum: ['Active', 'Inactive', 'On Leave', 'In Surgery', 'Off Duty']
        },
        shift: {
          enum: ['Day', 'Evening', 'Night', 'Rotating']
        }
      }
    }
  }
});

db.createCollection('doctors', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['employeeId', 'name', 'specialization', 'department', 'phone', 'email', 'medicalLicense'],
      properties: {
        employeeId: { bsonType: 'string' },
        name: { bsonType: 'string' },
        specialization: { bsonType: 'string' },
        department: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        email: { bsonType: 'string' },
        medicalLicense: { bsonType: 'string' },
        status: {
          enum: ['Available', 'In Surgery', 'In Consultation', 'Off Duty', 'On Call']
        }
      }
    }
  }
});

// Create indexes for better performance
db.staff.createIndex({ 'employeeId': 1 }, { unique: true });
db.staff.createIndex({ 'email': 1 }, { unique: true });
db.staff.createIndex({ 'department': 1, 'status': 1 });
db.staff.createIndex({ 'name': 'text', 'email': 'text' });

db.doctors.createIndex({ 'employeeId': 1 }, { unique: true });
db.doctors.createIndex({ 'email': 1 }, { unique: true });
db.doctors.createIndex({ 'medicalLicense': 1 }, { unique: true });
db.doctors.createIndex({ 'department': 1, 'status': 1 });
db.doctors.createIndex({ 'specialization': 1, 'status': 1 });
db.doctors.createIndex({ 'name': 'text', 'specialization': 'text' });

print('Database initialized successfully with collections and indexes');

// Insert sample data if collections are empty
if (db.staff.countDocuments() === 0) {
  db.staff.insertMany([
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
      totalPatients: 2847,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      employeeId: 'EMP002',
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  print('Sample staff data inserted');
}

if (db.doctors.countDocuments() === 0) {
  db.doctors.insertMany([
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
      achievements: ['Best Doctor Award 2023', 'Research Excellence Award'],
      createdAt: new Date(),
      updatedAt: new Date()
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
      achievements: ['Excellence in Patient Care', 'Medical Education Leadership Award'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  print('Sample doctor data inserted');
}

print('MongoDB initialization completed successfully!');
