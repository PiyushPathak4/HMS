import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

export interface EditField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'number' | 'date';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  disabled?: boolean;
}

interface EditDialogProps {
  title: string;
  description: string;
  data: Record<string, any>;
  fields: EditField[];
  onSave: (updatedData: Record<string, any>) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

export function EditDialog({ 
  title, 
  description, 
  data, 
  fields, 
  onSave, 
  isOpen, 
  onOpenChange,
  loading = false
}: EditDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setFormData({ ...data });
      setErrors({});
    }
  }, [isOpen, data]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && (!formData[field.key] || formData[field.key] === '')) {
        newErrors[field.key] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === 'email' && formData[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.key])) {
          newErrors[field.key] = 'Please enter a valid email address';
        }
      }
      
      // Phone validation
      if (field.type === 'phone' && formData[field.key]) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(formData[field.key])) {
          newErrors[field.key] = 'Please enter a valid phone number';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving data:', error);
      // You could set a general error state here
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: EditField) => {
    const value = formData[field.key] || '';
    const hasError = !!errors[field.key];

    switch (field.type) {
      case 'select':
        return (
          <Select 
            value={value} 
            onValueChange={(newValue) => handleFieldChange(field.key, newValue)}
            disabled={field.disabled}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={hasError ? 'border-red-500' : ''}
            rows={3}
          />
        );
      
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={hasError ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div 
                key={field.key} 
                className={field.type === 'textarea' ? 'md:col-span-2' : ''}
              >
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="mt-1">
                  {renderField(field)}
                  {errors[field.key] && (
                    <p className="text-sm text-red-500 mt-1">{errors[field.key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Quick Edit Button Component
interface EditButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'icon';
}

export function EditButton({ onClick, disabled = false, size = 'icon' }: EditButtonProps) {
  return (
    <Button 
      variant="ghost" 
      size={size} 
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8"
    >
      <Edit className="h-4 w-4" />
    </Button>
  );
}
