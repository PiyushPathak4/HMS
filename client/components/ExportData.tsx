import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { exportToCSV, exportToExcel, generatePDFReport } from '@/lib/utils-advanced';

interface ExportColumn {
  key: string;
  label: string;
  selected: boolean;
}

interface ExportDataProps {
  data: any[];
  filename: string;
  title: string;
  defaultColumns?: Array<{ key: string; label: string }>;
}

export function ExportData({ data, filename, title, defaultColumns }: ExportDataProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [columns, setColumns] = useState<ExportColumn[]>(() => {
    if (defaultColumns) {
      return defaultColumns.map(col => ({ ...col, selected: true }));
    }
    
    if (data.length > 0) {
      return Object.keys(data[0]).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        selected: !['id', 'createdAt', 'updatedAt'].includes(key) // Exclude common system fields by default
      }));
    }
    
    return [];
  });

  const handleColumnToggle = (columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, selected: !col.selected } : col
    ));
  };

  const getSelectedColumns = () => columns.filter(col => col.selected);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const selectedColumns = getSelectedColumns();
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to export');
      return;
    }

    const exportData = data.map(item => {
      const filteredItem: any = {};
      selectedColumns.forEach(col => {
        filteredItem[col.label] = item[col.key];
      });
      return filteredItem;
    });

    try {
      switch (format) {
        case 'csv':
          exportToCSV(exportData, filename, selectedColumns);
          break;
        case 'excel':
          exportToExcel(exportData, filename);
          break;
        case 'pdf':
          generatePDFReport(exportData, title, filename);
          break;
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('An error occurred during export. Please try again.');
    }
  };

  const quickExportCSV = () => {
    if (data.length === 0) {
      alert('No data available to export');
      return;
    }
    
    const selectedColumns = getSelectedColumns();
    if (selectedColumns.length === 0) {
      alert('No columns selected for export');
      return;
    }
    
    try {
      const exportData = data.map(item => {
        const filteredItem: any = {};
        selectedColumns.forEach(col => {
          filteredItem[col.label] = item[col.key];
        });
        return filteredItem;
      });
      exportToCSV(exportData, filename, selectedColumns);
    } catch (error) {
      console.error('Quick export error:', error);
      alert('An error occurred during export. Please try again.');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Quick Export</DropdownMenuLabel>
          <DropdownMenuItem onClick={quickExportCSV}>
            <FileText className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Advanced Export</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Custom Export...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export {title}</DialogTitle>
            <DialogDescription>
              Select the columns you want to include in the export
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={columns.length > 0 && columns.every(col => col.selected)}
                  onCheckedChange={(checked) => {
                    setColumns(prev => prev.map(col => ({ ...col, selected: !!checked })));
                  }}
                />
                <Label htmlFor="select-all" className="font-medium">
                  Select All
                </Label>
              </div>
              {columns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2 pl-6">
                  <Checkbox
                    id={column.key}
                    checked={column.selected}
                    onCheckedChange={() => handleColumnToggle(column.key)}
                  />
                  <Label htmlFor={column.key} className="text-sm">
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {getSelectedColumns().length} column(s) selected
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                disabled={getSelectedColumns().length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                disabled={getSelectedColumns().length === 0}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={getSelectedColumns().length === 0}
              >
                <Printer className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Simple export component for quick CSV exports
export function SimpleExport({ data, filename, title }: ExportDataProps) {
  const handleQuickExport = () => {
    if (data.length === 0) {
      alert('No data available to export');
      return;
    }
    
    try {
      exportToCSV(data, filename);
    } catch (error) {
      console.error('Simple export error:', error);
      alert('An error occurred during export. Please try again.');
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleQuickExport}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
