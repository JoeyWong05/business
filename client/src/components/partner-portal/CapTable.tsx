import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Download, 
  PieChart, 
  UserPlus, 
  FileText, 
  Clock, 
  Calendar,
  Info
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CapTableProps {
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

interface Stakeholder {
  id: string;
  name: string;
  email?: string;
  role: string;
  shares: number;
  percentage: number;
  avatar?: string;
  investmentDate?: Date;
  investmentAmount?: number;
  shareClass: 'common' | 'preferred' | 'options';
  notes?: string;
}

interface CapTableDocument {
  id: string;
  title: string;
  type: string;
  date: Date;
  fileUrl: string;
  fileSize: string;
  addedBy: string;
}

// Sample data for cap tables
const getCapTableData = (companyId: string) => {
  const data = {
    'dmp': {
      valuation: 4800000,
      totalShares: 1000000,
      lastUpdated: new Date(2023, 3, 15),
      stakeholders: [
        {
          id: '1',
          name: 'Marcus Chen',
          email: 'marcus@digitalmerchhq.com',
          role: 'Founder & CEO',
          shares: 400000,
          percentage: 40,
          avatar: '/avatars/marcus.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2020, 0, 15),
          notes: 'Original founder with 4-year vesting schedule.'
        },
        {
          id: '2',
          name: 'Jennifer Torres',
          email: 'jennifer@digitalmerchhq.com',
          role: 'Co-Founder & CTO',
          shares: 300000,
          percentage: 30,
          avatar: '/avatars/jennifer.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2020, 0, 15),
          notes: 'Original co-founder with 4-year vesting schedule.'
        },
        {
          id: '3',
          name: 'Seedlight Ventures',
          role: 'Seed Investor',
          shares: 150000,
          percentage: 15,
          avatar: '/avatars/seedlight.jpg',
          shareClass: 'preferred' as const,
          investmentDate: new Date(2021, 5, 22),
          investmentAmount: 750000,
          notes: 'Led seed round with $750K investment at $5M valuation cap.'
        },
        {
          id: '4',
          name: 'Tech Growth Fund',
          role: 'Series A Lead',
          shares: 100000, 
          percentage: 10,
          avatar: '/avatars/techgrowth.jpg',
          shareClass: 'preferred' as const,
          investmentDate: new Date(2022, 9, 10),
          investmentAmount: 1200000,
          notes: 'Series A lead investor with participation rights for next round.'
        },
        {
          id: '5',
          name: 'Employee Option Pool',
          role: 'ESOP',
          shares: 50000,
          percentage: 5,
          shareClass: 'options' as const,
          notes: '25% allocated, 75% available for future employees.'
        }
      ],
      documents: [
        {
          id: '1',
          title: 'Cap Table - Q1 2023',
          type: 'Excel',
          date: new Date(2023, 3, 15),
          fileUrl: '/documents/dmp-cap-table-q1-2023.xlsx',
          fileSize: '245 KB',
          addedBy: 'Marcus Chen'
        },
        {
          id: '2',
          title: 'Series A Term Sheet',
          type: 'PDF',
          date: new Date(2022, 9, 10),
          fileUrl: '/documents/dmp-series-a-term-sheet.pdf',
          fileSize: '1.2 MB',
          addedBy: 'Jennifer Torres'
        },
        {
          id: '3',
          title: 'ESOP Documentation',
          type: 'PDF',
          date: new Date(2022, 2, 18),
          fileUrl: '/documents/dmp-esop-docs.pdf',
          fileSize: '2.8 MB',
          addedBy: 'Marcus Chen'
        }
      ]
    },
    'mystery-hype': {
      valuation: 3200000,
      totalShares: 1000000,
      lastUpdated: new Date(2023, 2, 28),
      stakeholders: [
        {
          id: '1',
          name: 'Daniel Kim',
          email: 'daniel@mysteryhype.com',
          role: 'Founder & CEO',
          shares: 550000,
          percentage: 55,
          avatar: '/avatars/daniel.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2021, 3, 10),
          notes: 'Original founder with 4-year vesting schedule.'
        },
        {
          id: '2',
          name: 'Venture Accelerator',
          role: 'Seed Investor',
          shares: 200000,
          percentage: 20,
          avatar: '/avatars/venture.jpg',
          shareClass: 'preferred' as const,
          investmentDate: new Date(2022, 2, 15),
          investmentAmount: 640000,
          notes: 'Seed investor with observer rights on board.'
        },
        {
          id: '3',
          name: 'Angel Investor Syndicate',
          role: 'Angel Group',
          shares: 150000,
          percentage: 15,
          avatar: '/avatars/angels.jpg',
          shareClass: 'preferred' as const,
          investmentDate: new Date(2022, 5, 8),
          investmentAmount: 480000,
          notes: 'Group of 5 angel investors with pro-rata rights.'
        },
        {
          id: '4',
          name: 'Employee Option Pool',
          role: 'ESOP',
          shares: 100000,
          percentage: 10,
          shareClass: 'options' as const,
          notes: '40% allocated to existing team members.'
        }
      ],
      documents: [
        {
          id: '1',
          title: 'Cap Table - Q2 2023',
          type: 'Excel',
          date: new Date(2023, 2, 28),
          fileUrl: '/documents/mystery-cap-table-q2-2023.xlsx',
          fileSize: '188 KB',
          addedBy: 'Daniel Kim'
        },
        {
          id: '2',
          title: 'Investor Rights Agreement',
          type: 'PDF',
          date: new Date(2022, 2, 20),
          fileUrl: '/documents/mystery-investor-rights.pdf',
          fileSize: '950 KB',
          addedBy: 'Legal Team'
        }
      ]
    },
    'lonestar': {
      valuation: 2100000,
      totalShares: 1000000,
      lastUpdated: new Date(2023, 4, 10),
      stakeholders: [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@lonestarclothing.com',
          role: 'Founder & CEO',
          shares: 650000,
          percentage: 65,
          avatar: '/avatars/sarah.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2019, 6, 8),
          notes: 'Original founder with full vesting completed.'
        },
        {
          id: '2',
          name: 'Michael Davis',
          email: 'michael@lonestarclothing.com',
          role: 'Co-Founder & COO',
          shares: 200000,
          percentage: 20,
          avatar: '/avatars/michael.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2020, 4, 15),
          notes: 'Joined as co-founder in second year, 3-year vesting.'
        },
        {
          id: '3',
          name: 'Texas Growth Fund',
          role: 'Local Investor',
          shares: 100000,
          percentage: 10,
          avatar: '/avatars/texasgrowth.jpg',
          shareClass: 'preferred' as const,
          investmentDate: new Date(2022, 1, 12),
          investmentAmount: 210000,
          notes: 'Local investment fund focusing on Texas businesses.'
        },
        {
          id: '4',
          name: 'Employee Option Pool',
          role: 'ESOP',
          shares: 50000,
          percentage: 5,
          shareClass: 'options' as const,
          notes: '60% allocated to key employees.'
        }
      ],
      documents: [
        {
          id: '1',
          title: 'Cap Table - May 2023',
          type: 'Excel',
          date: new Date(2023, 4, 10),
          fileUrl: '/documents/lonestar-cap-table-may-2023.xlsx',
          fileSize: '165 KB',
          addedBy: 'Sarah Johnson'
        }
      ]
    },
    'alcoease': {
      valuation: 1800000,
      totalShares: 1000000,
      lastUpdated: new Date(2023, 3, 5),
      stakeholders: [
        {
          id: '1',
          name: 'Ryan Cooper',
          email: 'ryan@alcoease.com',
          role: 'Founder & CEO',
          shares: 450000,
          percentage: 45,
          avatar: '/avatars/ryan.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2021, 8, 10),
          notes: 'Original founder with 4-year vesting schedule.'
        },
        {
          id: '2',
          name: 'Andrea Martinez',
          email: 'andrea@alcoease.com',
          role: 'Co-Founder & CPO',
          shares: 250000,
          percentage: 25,
          avatar: '/avatars/andrea.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2021, 8, 10),
          notes: 'Original co-founder with 4-year vesting schedule.'
        },
        {
          id: '3',
          name: 'Health Innovation Partners',
          role: 'Institutional Investor',
          shares: 200000,
          percentage: 20,
          avatar: '/avatars/healthinnovation.jpg',
          shareClass: 'preferred' as const,
          investmentDate: new Date(2022, 6, 18),
          investmentAmount: 360000,
          notes: 'Focus on consumer health products, board seat.'
        },
        {
          id: '4',
          name: 'Friends & Family',
          role: 'Early Investors',
          shares: 50000,
          percentage: 5,
          shareClass: 'common' as const,
          investmentDate: new Date(2021, 9, 25),
          investmentAmount: 90000,
          notes: 'Collection of 8 friends and family investors.'
        },
        {
          id: '5',
          name: 'Employee Option Pool',
          role: 'ESOP',
          shares: 50000,
          percentage: 5,
          shareClass: 'options' as const,
          notes: '30% allocated to current team.'
        }
      ],
      documents: [
        {
          id: '1',
          title: 'Cap Table - Q1 2023',
          type: 'Excel',
          date: new Date(2023, 3, 5),
          fileUrl: '/documents/alcoease-cap-table-q1-2023.xlsx',
          fileSize: '210 KB',
          addedBy: 'Ryan Cooper'
        },
        {
          id: '2',
          title: 'Investor Update - Q1 2023',
          type: 'PDF',
          date: new Date(2023, 3, 10),
          fileUrl: '/documents/alcoease-investor-update-q1-2023.pdf',
          fileSize: '1.4 MB',
          addedBy: 'Andrea Martinez'
        }
      ]
    },
    'hide-cafe': {
      valuation: 950000,
      totalShares: 1000000,
      lastUpdated: new Date(2023, 2, 15),
      stakeholders: [
        {
          id: '1',
          name: 'Emma Wong',
          email: 'emma@hidecafe.com',
          role: 'Founder & CEO',
          shares: 550000,
          percentage: 55,
          avatar: '/avatars/emma.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2022, 1, 8),
          notes: 'Original founder with 3-year vesting schedule.'
        },
        {
          id: '2',
          name: 'Jason Lee',
          email: 'jason@hidecafe.com',
          role: 'Co-Founder & COO',
          shares: 250000,
          percentage: 25,
          avatar: '/avatars/jason.jpg',
          shareClass: 'common' as const,
          investmentDate: new Date(2022, 1, 8),
          notes: 'Original co-founder with 3-year vesting schedule.'
        },
        {
          id: '3',
          name: 'Hospitality Ventures',
          role: 'Seed Investor',
          shares: 150000,
          percentage: 15,
          avatar: '/avatars/hospitality.jpg',
          shareClass: 'preferred' as const,
          investmentDate: new Date(2022, 7, 20),
          investmentAmount: 142500,
          notes: 'Industry-specific investor with hospitality expertise.'
        },
        {
          id: '4',
          name: 'Employee Option Pool',
          role: 'ESOP',
          shares: 50000,
          percentage: 5,
          shareClass: 'options' as const,
          notes: '20% allocated to key staff members.'
        }
      ],
      documents: [
        {
          id: '1',
          title: 'Cap Table - Q1 2023',
          type: 'Excel',
          date: new Date(2023, 2, 15),
          fileUrl: '/documents/hidecafe-cap-table-q1-2023.xlsx',
          fileSize: '180 KB',
          addedBy: 'Emma Wong'
        }
      ]
    }
  };
  
  return data[companyId as keyof typeof data] || data['dmp'];
};

export function CapTable({ companyId, companyBranding }: CapTableProps) {
  const [activeTab, setActiveTab] = useState<string>('table');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false);
  
  const capTableData = getCapTableData(companyId);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Group stakeholders by share class
  const stakeholdersByClass = capTableData.stakeholders.reduce((acc, stakeholder) => {
    if (!acc[stakeholder.shareClass]) {
      acc[stakeholder.shareClass] = [];
    }
    acc[stakeholder.shareClass].push(stakeholder);
    return acc;
  }, {} as Record<string, Stakeholder[]>);

  // Define colors for the pie chart sections
  const getStakeholderColor = (stakeholder: Stakeholder) => {
    if (stakeholder.role.includes('Founder')) return '#4f46e5'; // Indigo
    if (stakeholder.role.includes('Investor')) return '#0ea5e9'; // Sky
    if (stakeholder.role.includes('ESOP')) return '#10b981'; // Emerald
    return '#8b5cf6'; // Violet
  };
  
  return (
    <div className="space-y-8">
      {/* Header with valuation and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Equity Structure</h3>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Current Valuation: {formatCurrency(capTableData.valuation)}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Last valuation from most recent financing round. This is used for estimating ownership value.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Cap Table</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Cap Table Document</DialogTitle>
                <DialogDescription>
                  Upload an Excel spreadsheet or PDF document with the latest cap table information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="title">Document Title</label>
                  <input id="title" className="col-span-3 p-2 border rounded" placeholder="Q2 2023 Cap Table" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="valuation">Current Valuation</label>
                  <input id="valuation" className="col-span-3 p-2 border rounded" placeholder="$5,000,000" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="date">Effective Date</label>
                  <input type="date" id="date" className="col-span-3 p-2 border rounded" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="file">File</label>
                  <input type="file" id="file" className="col-span-3" accept=".xlsx,.xls,.pdf" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                <Button>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={stakeholderDialogOpen} onOpenChange={setStakeholderDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Add Stakeholder</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stakeholder</DialogTitle>
                <DialogDescription>
                  Add a new investor, founder, or allocate to the employee pool.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="name">Name</label>
                  <input id="name" className="col-span-3 p-2 border rounded" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="role">Role</label>
                  <input id="role" className="col-span-3 p-2 border rounded" placeholder="Investor, Founder, etc." />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="shares">Shares</label>
                  <input id="shares" type="number" className="col-span-3 p-2 border rounded" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="shareClass">Share Class</label>
                  <select id="shareClass" className="col-span-3 p-2 border rounded">
                    <option value="common">Common</option>
                    <option value="preferred">Preferred</option>
                    <option value="options">Options</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="investmentDate">Investment Date</label>
                  <input type="date" id="investmentDate" className="col-span-3 p-2 border rounded" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="investmentAmount">Investment Amount</label>
                  <input id="investmentAmount" className="col-span-3 p-2 border rounded" placeholder="$500,000" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="notes">Notes</label>
                  <textarea id="notes" className="col-span-3 p-2 border rounded" rows={3}></textarea>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStakeholderDialogOpen(false)}>Cancel</Button>
                <Button>Add Stakeholder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span>Total Shares: {capTableData.totalShares.toLocaleString()}</span>
          <span className="mx-2">•</span>
          <span>Last Updated: {formatDate(capTableData.lastUpdated)}</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
      
      {/* Tabs for Table and Chart views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Tabular View</span>
          </TabsTrigger>
          <TabsTrigger value="chart" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span>Chart View</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Table View */}
        <TabsContent value="table" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shareholders</CardTitle>
              <CardDescription>Complete list of all equity stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Ownership %</TableHead>
                    <TableHead className="text-right">Est. Value</TableHead>
                    <TableHead>Investment Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capTableData.stakeholders.map((stakeholder) => (
                    <TableRow key={stakeholder.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={stakeholder.avatar} alt={stakeholder.name} />
                            <AvatarFallback>{stakeholder.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{stakeholder.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{stakeholder.role}</TableCell>
                      <TableCell>
                        <Badge variant={
                          stakeholder.shareClass === 'common' ? "default" :
                          stakeholder.shareClass === 'preferred' ? "secondary" : "outline"
                        }>
                          {stakeholder.shareClass.charAt(0).toUpperCase() + stakeholder.shareClass.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{stakeholder.shares.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{stakeholder.percentage}%</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency((stakeholder.percentage / 100) * capTableData.valuation)}
                      </TableCell>
                      <TableCell>
                        {stakeholder.investmentDate ? formatDate(stakeholder.investmentDate) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Cap Table Documents</CardTitle>
              <CardDescription>Related equity documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capTableData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.type} • {doc.fileSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-right text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(doc.date)}</span>
                        </div>
                        <p>Added by {doc.addedBy}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Chart View */}
        <TabsContent value="chart" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ownership Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Ownership Distribution</CardTitle>
                <CardDescription>Visual breakdown of company ownership</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Pie Chart: Ownership Distribution</p>
              </CardContent>
            </Card>
            
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Share Class Breakdown</CardTitle>
                <CardDescription>Allocation by share type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Common Shares */}
                  {stakeholdersByClass.common && (
                    <div>
                      <h4 className="font-semibold mb-2">Common Shares</h4>
                      <div className="space-y-2">
                        {stakeholdersByClass.common.map(s => (
                          <div key={s.id} className="flex justify-between items-center text-sm">
                            <span>{s.name}</span>
                            <span>{s.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Preferred Shares */}
                  {stakeholdersByClass.preferred && (
                    <div>
                      <h4 className="font-semibold mb-2">Preferred Shares</h4>
                      <div className="space-y-2">
                        {stakeholdersByClass.preferred.map(s => (
                          <div key={s.id} className="flex justify-between items-center text-sm">
                            <span>{s.name}</span>
                            <span>{s.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Options Pool */}
                  {stakeholdersByClass.options && (
                    <div>
                      <h4 className="font-semibold mb-2">Option Pool</h4>
                      <div className="space-y-2">
                        {stakeholdersByClass.options.map(s => (
                          <div key={s.id} className="flex justify-between items-center text-sm">
                            <span>{s.name}</span>
                            <span>{s.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Valuation History - Placeholder for future implementation */}
          <Card>
            <CardHeader>
              <CardTitle>Valuation History</CardTitle>
              <CardDescription>Company valuation over time</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Line Chart: Valuation History</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}