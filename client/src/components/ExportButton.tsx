import React, { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: any;
  filename?: string;
  title?: string;
  exportFormats?: Array<"pdf" | "csv" | "print">;
  className?: string;
}

export function ExportButton({ 
  data, 
  filename = "export", 
  title = "Export Options", 
  exportFormats = ["pdf", "csv", "print"],
  className
}: ExportButtonProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: "pdf" | "csv" | "print") => {
    setIsExporting(true);
    
    try {
      switch (format) {
        case "csv":
          await exportToCsv(data, filename);
          break;
        case "pdf":
          await exportToPdf(data, filename);
          break;
        case "print":
          window.print();
          break;
      }
      
      toast({
        title: "Export Successful",
        description: `Data exported as ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: `There was an error exporting as ${format.toUpperCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Export to CSV function
  const exportToCsv = async (dataToExport: any, filenameToUse: string) => {
    // Convert data to CSV format
    let csv = '';
    
    // Handle arrays of objects
    if (Array.isArray(dataToExport) && dataToExport.length > 0 && typeof dataToExport[0] === 'object') {
      // Get headers from first object
      const headers = Object.keys(dataToExport[0]);
      csv += headers.join(',') + '\n';
      
      // Add rows
      dataToExport.forEach(item => {
        const row = headers.map(header => {
          let cell = item[header];
          // Handle strings with commas by wrapping in quotes
          if (typeof cell === 'string' && cell.includes(',')) {
            return `"${cell}"`;
          }
          return cell;
        }).join(',');
        csv += row + '\n';
      });
    } 
    // Handle simple objects
    else if (typeof dataToExport === 'object' && dataToExport !== null) {
      Object.entries(dataToExport).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });
    }
    
    // Create a download link and trigger the download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filenameToUse}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Export to PDF function (simplified demo version)
  const exportToPdf = async (dataToExport: any, filenameToUse: string) => {
    // In a real implementation, you'd use a library like jsPDF, pdfmake, or html2pdf
    // For this demo, we'll simulate the PDF export with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is where you'd actually generate and download the PDF
    toast({
      title: "PDF Export (Demo)",
      description: "In a production environment, this would generate a PDF with your data",
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className} disabled={isExporting}>
          {isExporting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        
        {exportFormats.includes("pdf") && (
          <DropdownMenuItem onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
        )}
        
        {exportFormats.includes("csv") && (
          <DropdownMenuItem onClick={() => handleExport("csv")}>
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        )}
        
        {exportFormats.includes("print") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport("print")}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}