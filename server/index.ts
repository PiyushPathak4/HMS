import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectToDatabase } from "./db/connection";

// Staff routes
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getDepartments,
  getRoles,
  updateStaffStatus
} from "./routes/staff";

// Doctor routes
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getSpecializations,
  getDoctorDepartments,
  updateDoctorStatus,
  getAvailableDoctors
} from "./routes/doctors";

export function createServer() {
  const app = express();

  // Initialize database connection
  connectToDatabase().catch(console.error);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Staff API routes
  app.get("/api/staff", getAllStaff);
  app.get("/api/staff/departments", getDepartments);
  app.get("/api/staff/roles", getRoles);
  app.get("/api/staff/:id", getStaffById);
  app.post("/api/staff", createStaff);
  app.put("/api/staff/:id", updateStaff);
  app.delete("/api/staff/:id", deleteStaff);
  app.patch("/api/staff/:id/status", updateStaffStatus);

  // Doctor API routes
  app.get("/api/doctors", getAllDoctors);
  app.get("/api/doctors/available", getAvailableDoctors);
  app.get("/api/doctors/specializations", getSpecializations);
  app.get("/api/doctors/departments", getDoctorDepartments);
  app.get("/api/doctors/:id", getDoctorById);
  app.post("/api/doctors", createDoctor);
  app.put("/api/doctors/:id", updateDoctor);
  app.delete("/api/doctors/:id", deleteDoctor);
  app.patch("/api/doctors/:id/status", updateDoctorStatus);

  // Error handling middleware
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
