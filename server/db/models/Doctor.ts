import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  employeeId: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  medicalLicense: string;
  experience: string;
  status: 'Available' | 'In Surgery' | 'In Consultation' | 'Off Duty' | 'On Call';
  shift: 'Day' | 'Evening' | 'Night' | 'Rotating';
  schedule: string;
  education: string;
  certifications: string[];
  languages: string[];
  avatar?: string;
  rating: number;
  patientsToday: number;
  totalPatients: number;
  consultationFee?: number;
  joinDate: Date;
  lastActive?: Date;
  workingHours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bio?: string;
  achievements?: string[];
}

const DoctorSchema = new Schema<IDoctor>({
  employeeId: {
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
  specialization: {
    type: String,
    required: true,
    index: true
  },
  department: {
    type: String,
    required: true,
    index: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  medicalLicense: {
    type: String,
    required: true,
    unique: true
  },
  experience: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'In Surgery', 'In Consultation', 'Off Duty', 'On Call'],
    default: 'Available',
    index: true
  },
  shift: {
    type: String,
    enum: ['Day', 'Evening', 'Night', 'Rotating'],
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  certifications: [{
    type: String
  }],
  languages: [{
    type: String
  }],
  avatar: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  patientsToday: {
    type: Number,
    default: 0
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  consultationFee: {
    type: Number
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date
  },
  workingHours: {
    monday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    tuesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    wednesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    thursday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    friday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    saturday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '13:00' },
      available: { type: Boolean, default: false }
    },
    sunday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '13:00' },
      available: { type: Boolean, default: false }
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  bio: {
    type: String
  },
  achievements: [{
    type: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
DoctorSchema.index({ department: 1, status: 1 });
DoctorSchema.index({ specialization: 1, status: 1 });
DoctorSchema.index({ name: 'text', specialization: 'text' });

// Virtual for experience years
DoctorSchema.virtual('experienceYears').get(function() {
  const years = this.experience.match(/\d+/);
  return years ? parseInt(years[0]) : 0;
});

// Virtual for full name with title
DoctorSchema.virtual('fullTitle').get(function() {
  return `Dr. ${this.name}`;
});

// Pre-save middleware
DoctorSchema.pre('save', function(next) {
  if (this.isModified('status') && ['Available', 'In Consultation', 'In Surgery'].includes(this.status)) {
    this.lastActive = new Date();
  }
  next();
});

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);
