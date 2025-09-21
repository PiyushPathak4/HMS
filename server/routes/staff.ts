import { RequestHandler } from 'express';
import { Staff } from '../db/models/Staff';
import {
  CreateStaffSchema,
  UpdateStaffSchema,
  StaffQuerySchema,
  StaffResponse,
  PaginatedResponse
} from '../../shared/staff';
import { connectToDatabase } from '../db/connection';
import { inMemoryStorage } from './fallback-data';

// Helper function to transform Staff document to response
const transformStaffToResponse = (staff: any): StaffResponse => ({
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

// GET /api/staff - Get all staff with pagination and filtering
export const getAllStaff: RequestHandler = async (req, res) => {
  try {
    let staff: any[] = [];
    let useFallback = false;

    try {
      await connectToDatabase();

      const query = StaffQuerySchema.parse(req.query);
      const { page, limit, search, department, role, status, shift } = query;

      // Build filter object
      const filter: any = {};

      if (department) filter.department = new RegExp(department, 'i');
      if (role) filter.role = new RegExp(role, 'i');
      if (status) filter.status = status;
      if (shift) filter.shift = shift;

      if (search) {
        filter.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { employeeId: new RegExp(search, 'i') },
          { role: new RegExp(search, 'i') },
          { department: new RegExp(search, 'i') }
        ];
      }

      const skip = (page - 1) * limit;

      // Get total count and staff data
      const [total, staffData] = await Promise.all([
        Staff.countDocuments(filter),
        Staff.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
      ]);

      const response: PaginatedResponse<StaffResponse> = {
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
      console.log('Using fallback data due to MongoDB connection issue');
      useFallback = true;
    }

    if (useFallback) {
      const query = StaffQuerySchema.parse(req.query);
      const { page, limit, search, department, role, status, shift } = query;

      // Use in-memory fallback data
      let filteredStaff = inMemoryStorage.staff.getAll();

      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        filteredStaff = filteredStaff.filter(s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.employeeId.toLowerCase().includes(searchLower) ||
          s.role.toLowerCase().includes(searchLower) ||
          s.department.toLowerCase().includes(searchLower)
        );
      }

      if (department) filteredStaff = filteredStaff.filter(s => s.department.toLowerCase().includes(department.toLowerCase()));
      if (role) filteredStaff = filteredStaff.filter(s => s.role.toLowerCase().includes(role.toLowerCase()));
      if (status) filteredStaff = filteredStaff.filter(s => s.status === status);
      if (shift) filteredStaff = filteredStaff.filter(s => s.shift === shift);

      // Pagination
      const total = filteredStaff.length;
      const skip = (page - 1) * limit;
      const paginatedStaff = filteredStaff.slice(skip, skip + limit);

      const response: PaginatedResponse<StaffResponse> = {
        data: paginatedStaff as StaffResponse[],
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
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

// GET /api/staff/:id - Get staff by ID
export const getStaffById: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const staff = await Staff.findById(req.params.id).lean();
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    res.json(transformStaffToResponse(staff));
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
};

// POST /api/staff - Create new staff member
export const createStaff: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const validatedData = CreateStaffSchema.parse(req.body);
    
    // Check if employee ID or email already exists
    const existingStaff = await Staff.findOne({
      $or: [
        { employeeId: validatedData.employeeId },
        { email: validatedData.email }
      ]
    });
    
    if (existingStaff) {
      return res.status(400).json({ 
        error: 'Staff member with this employee ID or email already exists' 
      });
    }
    
    const staff = new Staff(validatedData);
    await staff.save();
    
    res.status(201).json(transformStaffToResponse(staff.toObject()));
  } catch (error) {
    console.error('Error creating staff member:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create staff member' });
  }
};

// PUT /api/staff/:id - Update staff member
export const updateStaff: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const validatedData = UpdateStaffSchema.parse(req.body);
    
    // Check if email is being updated and already exists
    if (validatedData.email) {
      const existingStaff = await Staff.findOne({
        email: validatedData.email,
        _id: { $ne: req.params.id }
      });
      
      if (existingStaff) {
        return res.status(400).json({ 
          error: 'Staff member with this email already exists' 
        });
      }
    }
    
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    res.json(transformStaffToResponse(staff));
  } catch (error) {
    console.error('Error updating staff member:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update staff member' });
  }
};

// DELETE /api/staff/:id - Delete staff member
export const deleteStaff: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
};

// GET /api/staff/departments - Get unique departments
export const getDepartments: RequestHandler = async (req, res) => {
  try {
    try {
      await connectToDatabase();
      const departments = await Staff.distinct('department');
      res.json(departments.sort());
    } catch (dbError) {
      // Use fallback data
      const departments = inMemoryStorage.staff.getDepartments();
      res.json(departments.sort());
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// GET /api/staff/roles - Get unique roles
export const getRoles: RequestHandler = async (req, res) => {
  try {
    try {
      await connectToDatabase();
      const roles = await Staff.distinct('role');
      res.json(roles.sort());
    } catch (dbError) {
      // Use fallback data
      const roles = inMemoryStorage.staff.getRoles();
      res.json(roles.sort());
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// PATCH /api/staff/:id/status - Update staff status
export const updateStaffStatus: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { status, lastActive: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    res.json(transformStaffToResponse(staff));
  } catch (error) {
    console.error('Error updating staff status:', error);
    res.status(500).json({ error: 'Failed to update staff status' });
  }
};
