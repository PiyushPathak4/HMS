import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodType: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  status: 'Active' | 'Inactive' | 'Critical' | 'Discharged';
  condition?: string;
  assignedDoctor?: string;
  lastVisit?: Date;
  nextAppointment?: Date;
  avatar?: string;
  notes?: string;
}

const PatientSchema = new Schema<IPatient>({
  patientId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  },
  insurance: {
    provider: { type: String, required: true },
    policyNumber: { type: String, required: true },
    groupNumber: String
  },
  medicalHistory: [{
    type: String
  }],
  allergies: [{
    type: String
  }],
  currentMedications: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Critical', 'Discharged'],
    default: 'Active',
    index: true
  },
  condition: {
    type: String
  },
  assignedDoctor: {
    type: String
  },
  lastVisit: {
    type: Date
  },
  nextAppointment: {
    type: Date
  },
  avatar: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
PatientSchema.index({ status: 1 });
PatientSchema.index({ assignedDoctor: 1 });
PatientSchema.index({ name: 'text', email: 'text' });

// Virtual for full address
PatientSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Pre-save middleware
PatientSchema.pre('save', function(next) {
  if (this.isModified('dateOfBirth')) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema);