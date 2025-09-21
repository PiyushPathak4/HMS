import React from 'react';
import { Heart, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-medical-500">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-medical-600">MediCare+</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced Hospital Management System providing comprehensive healthcare solutions 
              with modern technology and compassionate care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/patients" className="text-muted-foreground hover:text-medical-600 transition-colors">
                  Patient Management
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-muted-foreground hover:text-medical-600 transition-colors">
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/records" className="text-muted-foreground hover:text-medical-600 transition-colors">
                  Medical Records
                </Link>
              </li>
              <li>
                <Link to="/staff" className="text-muted-foreground hover:text-medical-600 transition-colors">
                  Staff Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-medical-500" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-medical-500" />
                <span className="text-muted-foreground">info@medicareplus.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-medical-500" />
                <span className="text-muted-foreground">123 Healthcare Ave, Medical City</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Emergency & Hours</h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-emergency-50 p-3 border border-emergency-200">
                <div className="flex items-center space-x-2 text-emergency-700 font-medium">
                  <Phone className="h-4 w-4" />
                  <span>Emergency: 911</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-medical-500" />
                  <span className="font-medium text-foreground">Operating Hours</span>
                </div>
                <div className="text-muted-foreground pl-6">
                  <p>Mon - Fri: 24/7</p>
                  <p>Emergency: Always Open</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 MediCare+ Hospital Management System. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-medical-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-medical-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/support" className="text-muted-foreground hover:text-medical-600 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
