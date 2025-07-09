import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { FileText, Upload, Download, FileSearch, Calendar, Clock, Tag, Filter, PlusCircle, Search, FileArchive, FileCode, FilePieChart, File, FilePlus } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: string;
  status: 'active' | 'expired' | 'pending';
  entity: string;
  tags: string[];
}

export default function LegalDocuments() {
  const { demoMode } = useDemoMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Demo data for legal documents
  const demoDocuments: Document[] = [
    {
      id: "doc-001",
      name: "Articles of Incorporation",
      type: "incorporation",
      category: "formation",
      uploadDate: "2023-06-15",
      size: "3.2 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["essential", "formation"]
    },
    {
      id: "doc-002",
      name: "Operating Agreement",
      type: "agreement",
      category: "governance",
      uploadDate: "2023-06-18",
      size: "4.5 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["essential", "governance"]
    },
    {
      id: "doc-003",
      name: "Business License",
      type: "license",
      category: "compliance",
      uploadDate: "2023-07-02",
      size: "1.8 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["license", "compliance"]
    },
    {
      id: "doc-004",
      name: "Employer Identification Number (EIN)",
      type: "tax",
      category: "tax",
      uploadDate: "2023-06-20",
      size: "0.8 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["tax", "essential"]
    },
    {
      id: "doc-005",
      name: "Annual Report Filing",
      type: "report",
      category: "compliance",
      uploadDate: "2024-01-15",
      size: "2.7 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["report", "annual"]
    },
    {
      id: "doc-006",
      name: "Sales Tax Permit",
      type: "tax",
      category: "tax",
      uploadDate: "2023-07-12",
      size: "1.2 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["tax", "sales"]
    },
    {
      id: "doc-007",
      name: "Partnership Agreement",
      type: "agreement",
      category: "governance",
      uploadDate: "2023-06-25",
      size: "5.1 MB",
      status: "active",
      entity: "Mystery Hype",
      tags: ["agreement", "partnership"]
    },
    {
      id: "doc-008",
      name: "Trademark Registration",
      type: "intellectual-property",
      category: "intellectual-property",
      uploadDate: "2023-08-10",
      size: "2.3 MB",
      status: "pending",
      entity: "Mystery Hype",
      tags: ["trademark", "IP"]
    },
    {
      id: "doc-009",
      name: "Privacy Policy",
      type: "policy",
      category: "policy",
      uploadDate: "2023-07-28",
      size: "1.6 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["policy", "privacy"]
    },
    {
      id: "doc-010",
      name: "Terms of Service",
      type: "policy",
      category: "policy",
      uploadDate: "2023-07-28",
      size: "1.8 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["policy", "terms"]
    },
    {
      id: "doc-011",
      name: "Business Insurance Policy",
      type: "insurance",
      category: "insurance",
      uploadDate: "2023-09-05",
      size: "3.5 MB",
      status: "active",
      entity: "Lone Star Custom Clothing",
      tags: ["insurance", "policy"]
    },
    {
      id: "doc-012",
      name: "Employee Handbook",
      type: "employment",
      category: "employment",
      uploadDate: "2023-09-15",
      size: "6.2 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["employment", "handbook"]
    },
    {
      id: "doc-013",
      name: "Independent Contractor Agreement",
      type: "agreement",
      category: "employment",
      uploadDate: "2023-08-20",
      size: "2.8 MB",
      status: "active",
      entity: "Alcoeaze",
      tags: ["agreement", "contractor"]
    },
    {
      id: "doc-014",
      name: "Non-Disclosure Agreement",
      type: "agreement",
      category: "intellectual-property",
      uploadDate: "2023-07-18",
      size: "1.5 MB",
      status: "active",
      entity: "Hide Cafe Bars",
      tags: ["NDA", "confidentiality"]
    },
    {
      id: "doc-015",
      name: "Foreign Qualification",
      type: "compliance",
      category: "compliance",
      uploadDate: "2023-10-05",
      size: "1.7 MB",
      status: "active",
      entity: "Digital Merch Pros",
      tags: ["qualification", "compliance"]
    },
  ];

  // Categories for the filter select
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "formation", label: "Formation Documents" },
    { value: "governance", label: "Governance" },
    { value: "compliance", label: "Compliance" },
    { value: "tax", label: "Tax" },
    { value: "intellectual-property", label: "Intellectual Property" },
    { value: "policy", label: "Policies" },
    { value: "insurance", label: "Insurance" },
    { value: "employment", label: "Employment" }
  ];

  // Business entities
  const entities = [
    { value: "all", label: "All Entities" },
    { value: "Digital Merch Pros", label: "Digital Merch Pros" },
    { value: "Mystery Hype", label: "Mystery Hype" },
    { value: "Lone Star Custom Clothing", label: "Lone Star Custom Clothing" },
    { value: "Alcoeaze", label: "Alcoeaze" },
    { value: "Hide Cafe Bars", label: "Hide Cafe Bars" }
  ];

  // Status options
  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "pending", label: "Pending" }
  ];

  // Filter documents based on selected filters and search query
  const filteredDocuments = demoDocuments.filter(doc => {
    // Filter by category
    if (selectedCategory !== "all" && doc.category !== selectedCategory) {
      return false;
    }
    
    // Filter by entity
    if (selectedEntity !== "all" && doc.entity !== selectedEntity) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus !== "all" && doc.status !== selectedStatus) {
      return false;
    }
    
    // Filter by tab (document type)
    if (activeTab !== "all" && doc.type !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'incorporation':
        return <FileArchive className="h-5 w-5" />;
      case 'agreement':
        return <FileText className="h-5 w-5" />;
      case 'license':
        return <FilePieChart className="h-5 w-5" />;
      case 'tax':
        return <FileCode className="h-5 w-5" />;
      case 'report':
        return <FilePieChart className="h-5 w-5" />;
      case 'intellectual-property':
        return <FileSearch className="h-5 w-5" />;
      case 'policy':
        return <File className="h-5 w-5" />;
      case 'insurance':
        return <FilePlus className="h-5 w-5" />;
      case 'employment':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <MainLayout
      title="Legal Document Center"
      description="Manage, store, and organize all your legal documents in one secure location."
    >
      <div className="flex flex-col gap-6">
        {/* Header & Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Document Center
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              All your legal documents in one secure location
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Upload a new legal document to the document center.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="documentName">Document Name</Label>
                    <Input id="documentName" placeholder="Enter document name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="documentCategory">Category</Label>
                    <Select>
                      <SelectTrigger id="documentCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.value !== 'all').map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="documentEntity">Business Entity</Label>
                    <Select>
                      <SelectTrigger id="documentEntity">
                        <SelectValue placeholder="Select entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.filter(e => e.value !== 'all').map(entity => (
                          <SelectItem key={entity.value} value={entity.value}>
                            {entity.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="documentTags">Tags (comma separated)</Label>
                    <Input id="documentTags" placeholder="E.g. essential, tax, compliance" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="documentFile">Upload File</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drag & drop your file here or{" "}
                        <span className="text-blue-500 cursor-pointer">browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, DOCX, XLSX up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsUploadDialogOpen(false)}>
                    Upload Document
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Documents
            </Button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger>
              <SelectValue placeholder="Business Entity" />
            </SelectTrigger>
            <SelectContent>
              {entities.map(entity => (
                <SelectItem key={entity.value} value={entity.value}>
                  {entity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Document Type Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex overflow-x-auto flex-wrap">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="incorporation">Incorporation</TabsTrigger>
            <TabsTrigger value="agreement">Agreements</TabsTrigger>
            <TabsTrigger value="tax">Tax Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="intellectual-property">Intellectual Property</TabsTrigger>
            <TabsTrigger value="policy">Policies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <DocumentList documents={filteredDocuments} getDocumentTypeIcon={getDocumentTypeIcon} getStatusBadge={getStatusBadge} />
          </TabsContent>
          
          {['incorporation', 'agreement', 'tax', 'compliance', 'intellectual-property', 'policy'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              <DocumentList 
                documents={filteredDocuments} 
                getDocumentTypeIcon={getDocumentTypeIcon} 
                getStatusBadge={getStatusBadge} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}

interface DocumentListProps {
  documents: Document[];
  getDocumentTypeIcon: (type: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

function DocumentList({ documents, getDocumentTypeIcon, getStatusBadge }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileSearch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No documents found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {documents.map(doc => (
        <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center p-4 gap-4">
              <div className="flex-shrink-0 rounded-md bg-blue-50 dark:bg-blue-900 p-3">
                {getDocumentTypeIcon(doc.type)}
              </div>
              
              <div className="flex-grow space-y-1 text-center md:text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>Entity: {doc.entity}</span>
                  </div>
                  <div>{getStatusBadge(doc.status)}</div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-2">
                  {doc.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <FileSearch className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}