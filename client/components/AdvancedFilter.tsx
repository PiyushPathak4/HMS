import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Filter, X } from 'lucide-react';
import { FilterOptions } from '@/lib/utils-advanced';

interface AdvancedFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  options: {
    departments?: string[];
    roles?: string[];
    statuses?: string[];
    shifts?: string[];
    specializations?: string[];
    types?: string[];
    priorities?: string[];
  };
  fields: Array<{
    key: keyof FilterOptions;
    label: string;
    type: 'text' | 'select' | 'date';
    options?: string[];
  }>;
}

export function AdvancedFilter({ 
  filters, 
  onFiltersChange, 
  options, 
  fields 
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setIsOpen(false);
  };

  const activeFilterCount = Object.values(filters).filter(value => 
    value !== undefined && value !== ''
  ).length;

  const getSelectOptions = (field: { key: keyof FilterOptions; options?: string[] }) => {
    if (field.options) return field.options;
    
    switch (field.key) {
      case 'department': return options.departments || [];
      case 'role': return options.roles || [];
      case 'status': return options.statuses || [];
      case 'shift': return options.shifts || [];
      case 'specialization': return options.specializations || [];
      case 'type': return options.types || [];
      case 'priority': return options.priorities || [];
      default: return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filter
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Filter Options</DialogTitle>
          <DialogDescription>
            Apply multiple filters to narrow down your search results
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                
                {field.type === 'text' && (
                  <Input
                    id={field.key}
                    value={localFilters[field.key] || ''}
                    onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    placeholder={`Filter by ${field.label.toLowerCase()}`}
                  />
                )}
                
                {field.type === 'date' && (
                  <Input
                    id={field.key}
                    type="date"
                    value={localFilters[field.key] || ''}
                    onChange={(e) => handleFilterChange(field.key, e.target.value)}
                  />
                )}
                
                {field.type === 'select' && (
                  <Select
                    value={localFilters[field.key] || ''}
                    onValueChange={(value) => handleFilterChange(field.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All {field.label}s</SelectItem>
                      {getSelectOptions(field).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Quick filter component for common filters
interface QuickFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function QuickFilter({ value, onChange, placeholder = "Search..." }: QuickFilterProps) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-8"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={() => onChange('')}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
