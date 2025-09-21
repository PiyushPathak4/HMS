import { RequestHandler } from 'express';
import { Doctor } from '../db/models/Doctor';
import {
  CreateDoctorSchema,
  UpdateDoctorSchema,
  DoctorQuerySchema,
  DoctorResponse,
  PaginatedResponse
} from '../../shared/staff';
import { connectToDatabase } from '../db/connection';

// Helper function to transform Doctor document to response
const transformDoctorToResponse = (doctor: any): DoctorResponse => ({
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

// GET /api/doctors - Get all doctors with pagination and filtering
export const getAllDoctors: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const query = DoctorQuerySchema.parse(req.query);
    const { page, limit, search, department, specialization, status, shift } = query;
    
    // Build filter object
    const filter: any = {};
    
    if (department) filter.department = new RegExp(department, 'i');
    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    if (status) filter.status = status;
    if (shift) filter.shift = shift;
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { employeeId: new RegExp(search, 'i') },
        { specialization: new RegExp(search, 'i') },
        { department: new RegExp(search, 'i') }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    // Get total count and doctor data
    const [total, doctors] = await Promise.all([
      Doctor.countDocuments(filter),
      Doctor.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);
    
    const response: PaginatedResponse<DoctorResponse> = {
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
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// GET /api/doctors/:id - Get doctor by ID
export const getDoctorById: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(transformDoctorToResponse(doctor));
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// POST /api/doctors - Create new doctor
export const createDoctor: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const validatedData = CreateDoctorSchema.parse(req.body);
    
    // Check if employee ID, email, or medical license already exists
    const existingDoctor = await Doctor.findOne({
      $or: [
        { employeeId: validatedData.employeeId },
        { email: validatedData.email },
        { medicalLicense: validatedData.medicalLicense }
      ]
    });
    
    if (existingDoctor) {
      return res.status(400).json({ 
        error: 'Doctor with this employee ID, email, or medical license already exists' 
      });
    }
    
    const doctor = new Doctor(validatedData);
    await doctor.save();
    
    res.status(201).json(transformDoctorToResponse(doctor.toObject()));
  } catch (error) {
    console.error('Error creating doctor:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

// PUT /api/doctors/:id - Update doctor
export const updateDoctor: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const validatedData = UpdateDoctorSchema.parse(req.body);
    
    // Check if email or medical license is being updated and already exists
    if (validatedData.email || validatedData.medicalLicense) {
      const filter: any = { _id: { $ne: req.params.id } };
      
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
          error: 'Doctor with this email or medical license already exists' 
        });
      }
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(transformDoctorToResponse(doctor));
  } catch (error) {
    console.error('Error updating doctor:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update doctor' });
  }
};

// DELETE /api/doctors/:id - Delete doctor
export const deleteDoctor: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};

// GET /api/doctors/specializations - Get unique specializations
export const getSpecializations: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const specializations = await Doctor.distinct('specialization');
    res.json(specializations.sort());
  } catch (error) {
    console.error('Error fetching specializations:', error);
    res.status(500).json({ error: 'Failed to fetch specializations' });
  }
};

// GET /api/doctors/departments - Get unique departments
export const getDoctorDepartments: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const departments = await Doctor.distinct('department');
    res.json(departments.sort());
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// PATCH /api/doctors/:id/status - Update doctor status
export const updateDoctorStatus: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status, lastActive: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(transformDoctorToResponse(doctor));
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ error: 'Failed to update doctor status' });
  }
};

// GET /api/doctors/available - Get available doctors for appointments
export const getAvailableDoctors: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { department, specialization } = req.query;
    
    const filter: any = { status: { $in: ['Available', 'On Call'] } };
    
    if (department) filter.department = department;
    if (specialization) filter.specialization = specialization;
    
    const doctors = await Doctor.find(filter)
      .select('name specialization department status rating consultationFee')
      .sort({ rating: -1 })
      .lean();
    
    res.json(doctors.map(transformDoctorToResponse));
  } catch (error) {
    console.error('Error fetching available doctors:', error);
    res.status(500).json({ error: 'Failed to fetch available doctors' });
  }
};
