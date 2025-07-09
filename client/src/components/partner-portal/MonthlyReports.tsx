import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  Download, 
  FileText, 
  Video, 
  ExternalLink, 
  Upload, 
  MoreHorizontal, 
  Clock,
  Eye,
  Play
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MonthlyReportsProps {
  companyId: string;
  companyBranding: {
    name: string;
    logo: string;
    logoFallback: string;
    primaryColor: string;
    secondaryColor: string;
    gradient: string;
  };
}

interface Report {
  id: string;
  title: string;
  month: string;
  year: number;
  date: Date;
  type: 'pdf' | 'video';
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: string;
  duration?: string;
  addedBy: string;
  addedByAvatar?: string;
  description?: string;
}

// Sample reports data
const getSampleReports = (companyId: string): Report[] => {
  const commonReports = [
    {
      id: '1',
      title: 'Monthly Financial Summary',
      month: 'January',
      year: 2023,
      date: new Date(2023, 0, 31),
      type: 'pdf' as const,
      fileUrl: '/reports/january-financial-summary.pdf',
      fileSize: '2.4 MB',
      addedBy: 'Sarah Johnson',
      addedByAvatar: '/avatars/sarah.jpg',
      description: 'Comprehensive financial summary including sales, revenue, expenses, and profit margins.'
    },
    {
      id: '2',
      title: 'Q1 Performance Report',
      month: 'March',
      year: 2023,
      date: new Date(2023, 2, 31),
      type: 'pdf' as const,
      fileUrl: '/reports/q1-performance.pdf',
      fileSize: '3.8 MB',
      addedBy: 'Michael Chen',
      addedByAvatar: '/avatars/michael.jpg',
      description: 'Quarterly performance analysis with detailed metrics on growth, customer acquisition, and market positioning.'
    },
    {
      id: '3',
      title: 'CEO Monthly Update',
      month: 'February',
      year: 2023,
      date: new Date(2023, 1, 28),
      type: 'video' as const,
      fileUrl: '/reports/february-ceo-update.mp4',
      thumbnailUrl: '/reports/thumbnails/february-update.jpg',
      fileSize: '148 MB',
      duration: '12:45',
      addedBy: 'David Wilson',
      addedByAvatar: '/avatars/david.jpg',
      description: 'CEO update on company progress, milestones, and future strategic directions.'
    },
    {
      id: '4',
      title: 'Market Expansion Strategy',
      month: 'April',
      year: 2023,
      date: new Date(2023, 3, 15),
      type: 'pdf' as const,
      fileUrl: '/reports/market-expansion.pdf',
      fileSize: '5.2 MB',
      addedBy: 'Jennifer Lopez',
      addedByAvatar: '/avatars/jennifer.jpg',
      description: 'Detailed strategy for expanding into new markets with competitive analysis and growth projections.'
    },
    {
      id: '5',
      title: 'Quarterly Investor Briefing',
      month: 'June',
      year: 2023,
      date: new Date(2023, 5, 30),
      type: 'video' as const,
      fileUrl: '/reports/q2-investor-briefing.mp4',
      thumbnailUrl: '/reports/thumbnails/q2-briefing.jpg',
      fileSize: '232 MB',
      duration: '28:17',
      addedBy: 'Robert Green',
      addedByAvatar: '/avatars/robert.jpg',
      description: 'Comprehensive overview of company performance and future projections for investors.'
    }
  ];
  
  // Different reports based on company
  const companySpecificReports: Record<string, Report[]> = {
    'dmp': [
      {
        id: '6',
        title: 'Digital Marketing ROI Analysis',
        month: 'May',
        year: 2023,
        date: new Date(2023, 4, 20),
        type: 'pdf' as const,
        fileUrl: '/reports/dmp-marketing-roi.pdf',
        fileSize: '4.1 MB',
        addedBy: 'Alex Turner',
        addedByAvatar: '/avatars/alex.jpg',
        description: 'Analysis of return on investment across all digital marketing channels.'
      }
    ],
    'mystery-hype': [
      {
        id: '6',
        title: 'Product Launch Post-Mortem',
        month: 'May',
        year: 2023,
        date: new Date(2023, 4, 18),
        type: 'pdf' as const,
        fileUrl: '/reports/mystery-hype-launch.pdf',
        fileSize: '3.5 MB',
        addedBy: 'Sophia Martinez',
        addedByAvatar: '/avatars/sophia.jpg',
        description: 'Review and analysis of the recent product launch performance and lessons learned.'
      }
    ],
    'lonestar': [
      {
        id: '6',
        title: 'Supply Chain Optimization',
        month: 'May',
        year: 2023,
        date: new Date(2023, 4, 15),
        type: 'pdf' as const,
        fileUrl: '/reports/lonestar-supply-chain.pdf',
        fileSize: '6.2 MB',
        addedBy: 'Thomas Wright',
        addedByAvatar: '/avatars/thomas.jpg',
        description: 'Overview of supply chain improvements and cost-saving initiatives.'
      }
    ],
    'alcoease': [
      {
        id: '6',
        title: 'Regulatory Compliance Update',
        month: 'May',
        year: 2023,
        date: new Date(2023, 4, 22),
        type: 'pdf' as const,
        fileUrl: '/reports/alcoease-compliance.pdf',
        fileSize: '2.8 MB',
        addedBy: 'Emily Clark',
        addedByAvatar: '/avatars/emily.jpg',
        description: 'Update on regulatory compliance status and upcoming regulatory changes.'
      }
    ],
    'hide-cafe': [
      {
        id: '6',
        title: 'New Location Analysis',
        month: 'May',
        year: 2023,
        date: new Date(2023, 4, 25),
        type: 'pdf' as const,
        fileUrl: '/reports/hide-cafe-expansion.pdf',
        fileSize: '5.7 MB',
        addedBy: 'Daniel Kim',
        addedByAvatar: '/avatars/daniel.jpg',
        description: 'Analysis of potential new locations with market demographics and revenue projections.'
      }
    ]
  };
  
  const companyReports = companySpecificReports[companyId] || [];
  return [...commonReports, ...companyReports].sort((a, b) => b.date.getTime() - a.date.getTime());
};

export function MonthlyReports({ companyId, companyBranding }: MonthlyReportsProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const reports = getSampleReports(companyId);
  
  // Group reports by year and month
  const groupedReports = reports.reduce((acc, report) => {
    const yearKey = report.year.toString();
    if (!acc[yearKey]) {
      acc[yearKey] = [];
    }
    acc[yearKey].push(report);
    return acc;
  }, {} as Record<string, Report[]>);
  
  // Sort years in descending order
  const sortedYears = Object.keys(groupedReports).sort((a, b) => parseInt(b) - parseInt(a));
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-8">
      {/* Header with upload button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Monthly Reports</h3>
          <p className="text-muted-foreground">Access and download company reports and updates</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Report</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Report</DialogTitle>
              <DialogDescription>
                Upload a PDF document or video update to share with partners and investors.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="title">Report Title</label>
                <input id="title" className="col-span-3 p-2 border rounded" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="month">Month</label>
                <select id="month" className="col-span-3 p-2 border rounded">
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="description">Description</label>
                <textarea id="description" className="col-span-3 p-2 border rounded" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="file">File</label>
                <input type="file" id="file" className="col-span-3" accept=".pdf,.mp4,.mov" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
              <Button>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Reports list by year */}
      <div className="space-y-6">
        {sortedYears.map((year) => (
          <div key={year} className="space-y-4">
            <h4 className="text-xl font-semibold">{year}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedReports[year].map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  {report.type === 'video' && report.thumbnailUrl ? (
                    <div className="relative h-40 bg-muted">
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${report.thumbnailUrl})` }}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="rounded-full h-14 w-14 bg-primary/20 border-primary"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Play className="h-6 w-6 text-primary-foreground" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {report.duration}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 bg-muted flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedReport(report)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Preview</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{report.month} {report.year}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Badge variant="outline" className="font-normal">
                        {report.type === 'pdf' ? 'PDF' : 'VIDEO'}
                      </Badge>
                      <span>{report.fileSize}</span>
                    </div>
                    {report.description && <p className="line-clamp-2">{report.description}</p>}
                  </CardContent>
                  <CardFooter className="pt-2 text-xs text-muted-foreground flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>{formatDate(report.date)}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Report Preview Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedReport.title}</DialogTitle>
              <DialogDescription>
                {selectedReport.month} {selectedReport.year} • Added by {selectedReport.addedBy}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedReport.type === 'pdf' ? (
                <div className="bg-muted h-[60vh] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <FileText className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-muted-foreground">PDF Preview Placeholder</p>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-black h-[60vh] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Video className="h-16 w-16 text-white/50" />
                    <p className="text-white/70">Video Preview Placeholder</p>
                    <Button variant="outline" className="bg-transparent text-white border-white">
                      <Play className="mr-2 h-4 w-4" />
                      Play Video
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}