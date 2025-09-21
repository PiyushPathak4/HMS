import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import { z } from "zod";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicare-plus";
let isConnected = false;
async function connectToDatabase() {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5e3,
      // Timeout after 5 seconds
      connectTimeoutMS: 1e4
      // Give up initial connection after 10 seconds
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.log("💡 Tip: Make sure MongoDB is running or use MongoDB Atlas cloud database");
    console.log("💡 For MongoDB Atlas: Set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicare-plus");
    console.log("⚠️ Using fallback data mode - database operations will use in-memory storage");
  }
}
async function disconnectFromDatabase() {
  if (!isConnected) {
    return;
  }
  try {
    await mongoose.disconnect();
    isConnected = true;
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
    throw error;
  }
}
process.on("SIGINT", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});
const StaffSchema = new Schema({
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
    enum: ["Active", "Inactive", "On Leave", "In Surgery", "Off Duty"],
    default: "Active",
    index: true
  },
  shift: {
    type: String,
    enum: ["Day", "Evening", "Night", "Rotating"],
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
StaffSchema.index({ department: 1, status: 1 });
StaffSchema.index({ role: 1, status: 1 });
StaffSchema.index({ name: "text", email: "text" });
StaffSchema.virtual("experienceYears").get(function() {
  const years = this.experience.match(/\d+/);
  return years ? parseInt(years[0]) : 0;
});
StaffSchema.pre("save", function(next) {
  if (this.isModified("status") && this.status === "Active") {
    this.lastActive = /* @__PURE__ */ new Date();
  }
  next();
});
const Staff = mongoose.model("Staff", StaffSchema);
const StaffStatusSchema = z.enum(["Active", "Inactive", "On Leave", "In Surgery", "Off Duty"]);
const ShiftTypeSchema = z.enum(["Day", "Evening", "Night", "Rotating"]);
const CreateStaffSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
  license: z.string().optional(),
  experience: z.string().min(1, "Experience is required"),
  status: StaffStatusSchema.default("Active"),
  shift: ShiftTypeSchema,
  schedule: z.string().min(1, "Schedule is required"),
  specializations: z.array(z.string()).default([]),
  education: z.string().min(1, "Education is required"),
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
const UpdateStaffSchema = CreateStaffSchema.partial().omit({ employeeId: true });
const StaffQuerySchema = z.object({
  department: z.string().optional(),
  role: z.string().optional(),
  status: StaffStatusSchema.optional(),
  shift: ShiftTypeSchema.optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10")
});
const DoctorStatusSchema = z.enum(["Available", "In Surgery", "In Consultation", "Off Duty", "On Call"]);
const CreateDoctorSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  department: z.string().min(1, "Department is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
  medicalLicense: z.string().min(1, "Medical license is required"),
  experience: z.string().min(1, "Experience is required"),
  status: DoctorStatusSchema.default("Available"),
  shift: ShiftTypeSchema,
  schedule: z.string().min(1, "Schedule is required"),
  education: z.string().min(1, "Education is required"),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default(["English"]),
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
const UpdateDoctorSchema = CreateDoctorSchema.partial().omit({ employeeId: true });
const DoctorQuerySchema = z.object({
  department: z.string().optional(),
  specialization: z.string().optional(),
  status: DoctorStatusSchema.optional(),
  shift: ShiftTypeSchema.optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10")
});
const fallbackStaffData = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Dr. Emily Smith",
    role: "Cardiologist",
    department: "Cardiology",
    phone: "+1 (555) 123-4567",
    email: "emily.smith@medicare.com",
    license: "MD123456",
    experience: "12 years",
    status: "Active",
    shift: "Day",
    schedule: "Mon-Fri 8AM-6PM",
    specializations: ["Interventional Cardiology", "Heart Failure"],
    education: "MD - Harvard Medical School",
    certifications: ["Board Certified Cardiologist", "ACLS", "BLS"],
    rating: 4.9,
    patientsToday: 12,
    totalPatients: 2847,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Dr. Robert Wilson",
    role: "Internal Medicine",
    department: "Internal Medicine",
    phone: "+1 (555) 987-6543",
    email: "robert.wilson@medicare.com",
    license: "MD789012",
    experience: "15 years",
    status: "Active",
    shift: "Day",
    schedule: "Mon-Fri 7AM-5PM",
    specializations: ["Diabetes Management", "Hypertension"],
    education: "MD - Johns Hopkins University",
    certifications: ["Internal Medicine Board Certified", "ACLS", "BLS"],
    rating: 4.8,
    patientsToday: 15,
    totalPatients: 3124,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Sarah Johnson",
    role: "Registered Nurse",
    department: "Emergency",
    phone: "+1 (555) 456-7890",
    email: "sarah.johnson@medicare.com",
    license: "RN345678",
    experience: "8 years",
    status: "Active",
    shift: "Night",
    schedule: "Mon-Wed-Fri 6PM-6AM",
    specializations: ["Emergency Care", "Trauma Nursing"],
    education: "BSN - University of California",
    certifications: ["CCRN", "ACLS", "BLS", "PALS"],
    rating: 4.9,
    patientsToday: 0,
    totalPatients: 1567,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Dr. Lisa Brown",
    role: "Orthopedic Surgeon",
    department: "Orthopedics",
    phone: "+1 (555) 234-5678",
    email: "lisa.brown@medicare.com",
    license: "MD456789",
    experience: "10 years",
    status: "In Surgery",
    shift: "Day",
    schedule: "Tue-Thu-Sat 8AM-8PM",
    specializations: ["Joint Replacement", "Sports Medicine"],
    education: "MD - Stanford University",
    certifications: ["Orthopedic Surgery Board Certified", "ACLS", "BLS"],
    rating: 4.7,
    patientsToday: 6,
    totalPatients: 1834,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Mike Thompson",
    role: "Radiology Technician",
    department: "Radiology",
    phone: "+1 (555) 345-6789",
    email: "mike.thompson@medicare.com",
    license: "RT123456",
    experience: "6 years",
    status: "Active",
    shift: "Day",
    schedule: "Mon-Fri 9AM-5PM",
    specializations: ["CT Imaging", "MRI", "X-Ray"],
    education: "Associates - Community College",
    certifications: ["ARRT Certified", "CT Certified", "MRI Certified"],
    rating: 4.6,
    patientsToday: 28,
    totalPatients: 892,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
const fallbackDoctorData = [
  {
    id: "1",
    employeeId: "DOC001",
    name: "Emily Smith",
    specialization: "Cardiology",
    department: "Cardiology",
    phone: "+1 (555) 123-4567",
    email: "emily.smith.md@medicare.com",
    medicalLicense: "MD123456789",
    experience: "12 years",
    status: "Available",
    shift: "Day",
    schedule: "Mon-Fri 8AM-6PM",
    education: "MD - Harvard Medical School",
    certifications: ["Board Certified Cardiologist", "ACLS", "BLS"],
    languages: ["English", "Spanish"],
    rating: 4.9,
    patientsToday: 12,
    totalPatients: 2847,
    consultationFee: 250,
    bio: "Dr. Emily Smith is a highly experienced cardiologist specializing in interventional cardiology and heart failure management.",
    achievements: ["Best Doctor Award 2023", "Research Excellence Award", "500+ Successful Cardiac Procedures"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "2",
    employeeId: "DOC002",
    name: "Robert Wilson",
    specialization: "Internal Medicine",
    department: "Internal Medicine",
    phone: "+1 (555) 987-6543",
    email: "robert.wilson.md@medicare.com",
    medicalLicense: "MD987654321",
    experience: "15 years",
    status: "Available",
    shift: "Day",
    schedule: "Mon-Fri 7AM-5PM",
    education: "MD - Johns Hopkins University",
    certifications: ["Internal Medicine Board Certified", "ACLS", "BLS"],
    languages: ["English"],
    rating: 4.8,
    patientsToday: 15,
    totalPatients: 3124,
    consultationFee: 200,
    bio: "Dr. Robert Wilson is an expert in internal medicine with extensive experience in diabetes management and hypertension.",
    achievements: ["Excellence in Patient Care", "Medical Education Leadership Award"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "3",
    employeeId: "DOC003",
    name: "Lisa Brown",
    specialization: "Orthopedic Surgery",
    department: "Orthopedics",
    phone: "+1 (555) 234-5678",
    email: "lisa.brown.md@medicare.com",
    medicalLicense: "MD456789123",
    experience: "10 years",
    status: "In Surgery",
    shift: "Day",
    schedule: "Tue-Thu-Sat 8AM-8PM",
    education: "MD - Stanford University",
    certifications: ["Orthopedic Surgery Board Certified", "ACLS", "BLS"],
    languages: ["English", "French"],
    rating: 4.7,
    patientsToday: 6,
    totalPatients: 1834,
    consultationFee: 300,
    bio: "Dr. Lisa Brown specializes in joint replacement and sports medicine with a focus on minimally invasive techniques.",
    achievements: ["Top Surgeon Award", "Innovation in Orthopedic Surgery", "1000+ Successful Joint Replacements"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
let staffMemory = [...fallbackStaffData];
let doctorMemory = [...fallbackDoctorData];
const inMemoryStorage = {
  staff: {
    getAll: () => staffMemory,
    getById: (id) => staffMemory.find((s) => s.id === id),
    create: (data) => {
      const newStaff = { ...data, id: Date.now().toString(), createdAt: (/* @__PURE__ */ new Date()).toISOString(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      staffMemory.push(newStaff);
      return newStaff;
    },
    update: (id, data) => {
      const index = staffMemory.findIndex((s) => s.id === id);
      if (index !== -1) {
        staffMemory[index] = { ...staffMemory[index], ...data, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        return staffMemory[index];
      }
      return null;
    },
    delete: (id) => {
      const index = staffMemory.findIndex((s) => s.id === id);
      if (index !== -1) {
        staffMemory.splice(index, 1);
        return true;
      }
      return false;
    },
    getDepartments: () => [...new Set(staffMemory.map((s) => s.department))],
    getRoles: () => [...new Set(staffMemory.map((s) => s.role))]
  },
  doctors: {
    getAll: () => doctorMemory,
    getById: (id) => doctorMemory.find((d) => d.id === id),
    create: (data) => {
      const newDoctor = { ...data, id: Date.now().toString(), createdAt: (/* @__PURE__ */ new Date()).toISOString(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      doctorMemory.push(newDoctor);
      return newDoctor;
    },
    update: (id, data) => {
      const index = doctorMemory.findIndex((d) => d.id === id);
      if (index !== -1) {
        doctorMemory[index] = { ...doctorMemory[index], ...data, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        return doctorMemory[index];
      }
      return null;
    },
    delete: (id) => {
      const index = doctorMemory.findIndex((d) => d.id === id);
      if (index !== -1) {
        doctorMemory.splice(index, 1);
        return true;
      }
      return false;
    },
    getSpecializations: () => [...new Set(doctorMemory.map((d) => d.specialization))],
    getDepartments: () => [...new Set(doctorMemory.map((d) => d.department))]
  }
};
const transformStaffToResponse = (staff) => ({
  id: staff._id.toString(),
  employeeId: staff.employeeId,
  name: staff.name,
  role: staff.role,
  department: staff.department,
  phone: staff.phone,
  email: staff.email,
  license: staff.license,
  experience: staff.experience,
  status: staff.status,
  shift: staff.shift,
  schedule: staff.schedule,
  specializations: staff.specializations,
  education: staff.education,
  certifications: staff.certifications,
  avatar: staff.avatar,
  rating: staff.rating,
  patientsToday: staff.patientsToday,
  totalPatients: staff.totalPatients,
  createdAt: staff.createdAt.toISOString(),
  updatedAt: staff.updatedAt.toISOString()
});
const getAllStaff = async (req, res) => {
  try {
    let staff = [];
    let useFallback = false;
    try {
      await connectToDatabase();
      const query = StaffQuerySchema.parse(req.query);
      const { page, limit, search, department, role, status, shift } = query;
      const filter = {};
      if (department) filter.department = new RegExp(department, "i");
      if (role) filter.role = new RegExp(role, "i");
      if (status) filter.status = status;
      if (shift) filter.shift = shift;
      if (search) {
        filter.$or = [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { employeeId: new RegExp(search, "i") },
          { role: new RegExp(search, "i") },
          { department: new RegExp(search, "i") }
        ];
      }
      const skip = (page - 1) * limit;
      const [total, staffData] = await Promise.all([
        Staff.countDocuments(filter),
        Staff.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
      ]);
      const response = {
        data: staffData.map(transformStaffToResponse),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
      res.json(response);
    } catch (dbError) {
      console.log("Using fallback data due to MongoDB connection issue");
      useFallback = true;
    }
    if (useFallback) {
      const query = StaffQuerySchema.parse(req.query);
      const { page, limit, search, department, role, status, shift } = query;
      let filteredStaff = inMemoryStorage.staff.getAll();
      if (search) {
        const searchLower = search.toLowerCase();
        filteredStaff = filteredStaff.filter(
          (s) => s.name.toLowerCase().includes(searchLower) || s.email.toLowerCase().includes(searchLower) || s.employeeId.toLowerCase().includes(searchLower) || s.role.toLowerCase().includes(searchLower) || s.department.toLowerCase().includes(searchLower)
        );
      }
      if (department) filteredStaff = filteredStaff.filter((s) => s.department.toLowerCase().includes(department.toLowerCase()));
      if (role) filteredStaff = filteredStaff.filter((s) => s.role.toLowerCase().includes(role.toLowerCase()));
      if (status) filteredStaff = filteredStaff.filter((s) => s.status === status);
      if (shift) filteredStaff = filteredStaff.filter((s) => s.shift === shift);
      const total = filteredStaff.length;
      const skip = (page - 1) * limit;
      const paginatedStaff = filteredStaff.slice(skip, skip + limit);
      const response = {
        data: paginatedStaff,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
      res.json(response);
    }
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};
const getStaffById = async (req, res) => {
  try {
    await connectToDatabase();
    const staff = await Staff.findById(req.params.id).lean();
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json(transformStaffToResponse(staff));
  } catch (error) {
    console.error("Error fetching staff member:", error);
    res.status(500).json({ error: "Failed to fetch staff member" });
  }
};
const createStaff = async (req, res) => {
  try {
    await connectToDatabase();
    const validatedData = CreateStaffSchema.parse(req.body);
    const existingStaff = await Staff.findOne({
      $or: [
        { employeeId: validatedData.employeeId },
        { email: validatedData.email }
      ]
    });
    if (existingStaff) {
      return res.status(400).json({
        error: "Staff member with this employee ID or email already exists"
      });
    }
    const staff = new Staff(validatedData);
    await staff.save();
    res.status(201).json(transformStaffToResponse(staff.toObject()));
  } catch (error) {
    console.error("Error creating staff member:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create staff member" });
  }
};
const updateStaff = async (req, res) => {
  try {
    await connectToDatabase();
    const validatedData = UpdateStaffSchema.parse(req.body);
    if (validatedData.email) {
      const existingStaff = await Staff.findOne({
        email: validatedData.email,
        _id: { $ne: req.params.id }
      });
      if (existingStaff) {
        return res.status(400).json({
          error: "Staff member with this email already exists"
        });
      }
    }
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).lean();
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json(transformStaffToResponse(staff));
  } catch (error) {
    console.error("Error updating staff member:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update staff member" });
  }
};
const deleteStaff = async (req, res) => {
  try {
    await connectToDatabase();
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    res.status(500).json({ error: "Failed to delete staff member" });
  }
};
const getDepartments = async (req, res) => {
  try {
    try {
      await connectToDatabase();
      const departments = await Staff.distinct("department");
      res.json(departments.sort());
    } catch (dbError) {
      const departments = inMemoryStorage.staff.getDepartments();
      res.json(departments.sort());
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};
const getRoles = async (req, res) => {
  try {
    try {
      await connectToDatabase();
      const roles = await Staff.distinct("role");
      res.json(roles.sort());
    } catch (dbError) {
      const roles = inMemoryStorage.staff.getRoles();
      res.json(roles.sort());
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};
const updateStaffStatus = async (req, res) => {
  try {
    await connectToDatabase();
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { status, lastActive: /* @__PURE__ */ new Date() },
      { new: true, runValidators: true }
    ).lean();
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json(transformStaffToResponse(staff));
  } catch (error) {
    console.error("Error updating staff status:", error);
    res.status(500).json({ error: "Failed to update staff status" });
  }
};
const DoctorSchema = new Schema({
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
    enum: ["Available", "In Surgery", "In Consultation", "Off Duty", "On Call"],
    default: "Available",
    index: true
  },
  shift: {
    type: String,
    enum: ["Day", "Evening", "Night", "Rotating"],
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
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
      available: { type: Boolean, default: true }
    },
    tuesday: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
      available: { type: Boolean, default: true }
    },
    wednesday: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
      available: { type: Boolean, default: true }
    },
    thursday: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
      available: { type: Boolean, default: true }
    },
    friday: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
      available: { type: Boolean, default: true }
    },
    saturday: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "13:00" },
      available: { type: Boolean, default: false }
    },
    sunday: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "13:00" },
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
DoctorSchema.index({ department: 1, status: 1 });
DoctorSchema.index({ specialization: 1, status: 1 });
DoctorSchema.index({ name: "text", specialization: "text" });
DoctorSchema.virtual("experienceYears").get(function() {
  const years = this.experience.match(/\d+/);
  return years ? parseInt(years[0]) : 0;
});
DoctorSchema.virtual("fullTitle").get(function() {
  return `Dr. ${this.name}`;
});
DoctorSchema.pre("save", function(next) {
  if (this.isModified("status") && ["Available", "In Consultation", "In Surgery"].includes(this.status)) {
    this.lastActive = /* @__PURE__ */ new Date();
  }
  next();
});
const Doctor = mongoose.model("Doctor", DoctorSchema);
const transformDoctorToResponse = (doctor) => ({
  id: doctor._id.toString(),
  employeeId: doctor.employeeId,
  name: doctor.name,
  specialization: doctor.specialization,
  department: doctor.department,
  phone: doctor.phone,
  email: doctor.email,
  medicalLicense: doctor.medicalLicense,
  experience: doctor.experience,
  status: doctor.status,
  shift: doctor.shift,
  schedule: doctor.schedule,
  education: doctor.education,
  certifications: doctor.certifications,
  languages: doctor.languages,
  avatar: doctor.avatar,
  rating: doctor.rating,
  patientsToday: doctor.patientsToday,
  totalPatients: doctor.totalPatients,
  consultationFee: doctor.consultationFee,
  bio: doctor.bio,
  achievements: doctor.achievements,
  createdAt: doctor.createdAt.toISOString(),
  updatedAt: doctor.updatedAt.toISOString()
});
const getAllDoctors = async (req, res) => {
  try {
    await connectToDatabase();
    const query = DoctorQuerySchema.parse(req.query);
    const { page, limit, search, department, specialization, status, shift } = query;
    const filter = {};
    if (department) filter.department = new RegExp(department, "i");
    if (specialization) filter.specialization = new RegExp(specialization, "i");
    if (status) filter.status = status;
    if (shift) filter.shift = shift;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { employeeId: new RegExp(search, "i") },
        { specialization: new RegExp(search, "i") },
        { department: new RegExp(search, "i") }
      ];
    }
    const skip = (page - 1) * limit;
    const [total, doctors] = await Promise.all([
      Doctor.countDocuments(filter),
      Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
    ]);
    const response = {
      data: doctors.map(transformDoctorToResponse),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};
const getDoctorById = async (req, res) => {
  try {
    await connectToDatabase();
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(transformDoctorToResponse(doctor));
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
};
const createDoctor = async (req, res) => {
  try {
    await connectToDatabase();
    const validatedData = CreateDoctorSchema.parse(req.body);
    const existingDoctor = await Doctor.findOne({
      $or: [
        { employeeId: validatedData.employeeId },
        { email: validatedData.email },
        { medicalLicense: validatedData.medicalLicense }
      ]
    });
    if (existingDoctor) {
      return res.status(400).json({
        error: "Doctor with this employee ID, email, or medical license already exists"
      });
    }
    const doctor = new Doctor(validatedData);
    await doctor.save();
    res.status(201).json(transformDoctorToResponse(doctor.toObject()));
  } catch (error) {
    console.error("Error creating doctor:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create doctor" });
  }
};
const updateDoctor = async (req, res) => {
  try {
    await connectToDatabase();
    const validatedData = UpdateDoctorSchema.parse(req.body);
    if (validatedData.email || validatedData.medicalLicense) {
      const filter = { _id: { $ne: req.params.id } };
      if (validatedData.email && validatedData.medicalLicense) {
        filter.$or = [
          { email: validatedData.email },
          { medicalLicense: validatedData.medicalLicense }
        ];
      } else if (validatedData.email) {
        filter.email = validatedData.email;
      } else if (validatedData.medicalLicense) {
        filter.medicalLicense = validatedData.medicalLicense;
      }
      const existingDoctor = await Doctor.findOne(filter);
      if (existingDoctor) {
        return res.status(400).json({
          error: "Doctor with this email or medical license already exists"
        });
      }
    }
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).lean();
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(transformDoctorToResponse(doctor));
  } catch (error) {
    console.error("Error updating doctor:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update doctor" });
  }
};
const deleteDoctor = async (req, res) => {
  try {
    await connectToDatabase();
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
};
const getSpecializations = async (req, res) => {
  try {
    await connectToDatabase();
    const specializations = await Doctor.distinct("specialization");
    res.json(specializations.sort());
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ error: "Failed to fetch specializations" });
  }
};
const getDoctorDepartments = async (req, res) => {
  try {
    await connectToDatabase();
    const departments = await Doctor.distinct("department");
    res.json(departments.sort());
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};
const updateDoctorStatus = async (req, res) => {
  try {
    await connectToDatabase();
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status, lastActive: /* @__PURE__ */ new Date() },
      { new: true, runValidators: true }
    ).lean();
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(transformDoctorToResponse(doctor));
  } catch (error) {
    console.error("Error updating doctor status:", error);
    res.status(500).json({ error: "Failed to update doctor status" });
  }
};
const getAvailableDoctors = async (req, res) => {
  try {
    await connectToDatabase();
    const { department, specialization } = req.query;
    const filter = { status: { $in: ["Available", "On Call"] } };
    if (department) filter.department = department;
    if (specialization) filter.specialization = specialization;
    const doctors = await Doctor.find(filter).select("name specialization department status rating consultationFee").sort({ rating: -1 }).lean();
    res.json(doctors.map(transformDoctorToResponse));
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    res.status(500).json({ error: "Failed to fetch available doctors" });
  }
};
function createServer() {
  const app2 = express__default();
  connectToDatabase().catch(console.error);
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.get("/api/staff", getAllStaff);
  app2.get("/api/staff/departments", getDepartments);
  app2.get("/api/staff/roles", getRoles);
  app2.get("/api/staff/:id", getStaffById);
  app2.post("/api/staff", createStaff);
  app2.put("/api/staff/:id", updateStaff);
  app2.delete("/api/staff/:id", deleteStaff);
  app2.patch("/api/staff/:id/status", updateStaffStatus);
  app2.get("/api/doctors", getAllDoctors);
  app2.get("/api/doctors/available", getAvailableDoctors);
  app2.get("/api/doctors/specializations", getSpecializations);
  app2.get("/api/doctors/departments", getDoctorDepartments);
  app2.get("/api/doctors/:id", getDoctorById);
  app2.post("/api/doctors", createDoctor);
  app2.put("/api/doctors/:id", updateDoctor);
  app2.delete("/api/doctors/:id", deleteDoctor);
  app2.patch("/api/doctors/:id/status", updateDoctorStatus);
  app2.use((err, _req, res, _next) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  });
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
