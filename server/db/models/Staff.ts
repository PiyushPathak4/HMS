import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  license?: string;
  experience: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'In Surgery' | 'Off Duty';
  shift: 'Day' | 'Evening' | 'Night' | 'Rotating';
  schedule: string;
  specializations: string[];
  education: string;
  certifications: string[];
  avatar?: string;
  rating: number;
  patientsToday: number;
  totalPatients: number;
  salary?: number;
  joinDate: Date;
  lastActive?: Date;
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
}

const StaffSchema = new Schema<IStaff>({
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
  role: {
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
  license: {
    type: String,
    sparse: true
  },
  experience: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave', 'In Surgery', 'Off Duty'],
    default: 'Active',
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
  specializations: [{
    type: String
  }],
  education: {
    type: String,
    required: true
  },
  certifications: [{
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
  salary: {
    type: Number
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
StaffSchema.index({ department: 1, status: 1 });
StaffSchema.index({ role: 1, status: 1 });
StaffSchema.index({ name: 'text', email: 'text' });

// Virtual for full experience calculation
StaffSchema.virtual('experienceYears').get(function() {
  const years = this.experience.match(/\d+/);
  return years ? parseInt(years[0]) : 0;
});

// Pre-save middleware
StaffSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Active') {
    this.lastActive = new Date();
  }
  next();
});

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
