import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
  title?: string;
}

export function EditButton({ onClick, className = '', title = 'Edit' }: EditButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 ${className}`}
      onClick={onClick}
      title={title}
    >
      <Edit className="h-4 w-4" />
    </Button>
  );
}