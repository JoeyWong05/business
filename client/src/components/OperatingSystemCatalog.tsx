import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileTextIcon, PlayIcon, FileIcon, CheckIcon, SearchIcon, PlusIcon, VideoIcon, Presentation, Users, BookOpen, Clipboard, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

interface Resource {
  id: string;
  title: string;
  department: Department;
  type: ResourceType;
  url?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

enum Department {
  OPERATING_SYSTEM = 'The Operating System (OS)',
  STRATEGY = 'Strategy, Forecasting, Planning',
  CUSTOMER_SUCCESS = 'Customer Success (LTV)',
  HIRING = 'Hiring & Sourcing Talent',
  ONBOARDING = 'Onboarding & Training Talent',
  MANAGEMENT = 'Management'
}

enum ResourceType {
  SOP = 'SOP',
  TRAINING = 'Training',
  EXAMPLE = 'Example',
  TEMPLATE = 'Template',
  VIDEO = 'Video',
  DOCUMENT = 'Document',
  WEBINAR = 'Webinar'
}

const departmentColors: Record<Department, string> = {
  [Department.OPERATING_SYSTEM]: 'bg-violet-500',
  [Department.STRATEGY]: 'bg-orange-300',
  [Department.CUSTOMER_SUCCESS]: 'bg-blue-300',
  [Department.HIRING]: 'bg-red-400',
  [Department.ONBOARDING]: 'bg-orange-500',
  [Department.MANAGEMENT]: 'bg-green-500'
};

const departmentIcons: Record<Department, React.ReactNode> = {
  [Department.OPERATING_SYSTEM]: <Presentation className="h-4 w-4" />,
  [Department.STRATEGY]: <Clipboard className="h-4 w-4" />,
  [Department.CUSTOMER_SUCCESS]: <Users className="h-4 w-4" />,
  [Department.HIRING]: <Users className="h-4 w-4" />,
  [Department.ONBOARDING]: <BookOpen className="h-4 w-4" />,
  [Department.MANAGEMENT]: <Users className="h-4 w-4" />
};

// Mock data based on the Airtable screenshots
const osResources: Resource[] = [
  {
    id: '1',
    title: 'Creating an SOP Creation Strategy & Process',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.TRAINING,
    url: 'https://vimeo.com/64834',
    createdAt: '2023-11-01',
    updatedAt: '2023-11-01'
  },
  {
    id: '2',
    title: 'Where to house SOPs (one option)',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.SOP,
    createdAt: '2023-11-02',
    updatedAt: '2023-11-02'
  },
  {
    id: '3',
    title: 'Client Example: Finished OS- Airtable',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.EXAMPLE,
    url: 'https://vimeo.com/65682',
    createdAt: '2023-11-03',
    updatedAt: '2023-11-03'
  },
  {
    id: '4',
    title: 'How to Keep your OS Update to Date for Years to Come',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.SOP,
    url: 'https://docs.google.com/document',
    createdAt: '2023-11-04',
    updatedAt: '2023-11-04'
  },
  {
    id: '5',
    title: 'Client Example- Finished OS- Asana',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.EXAMPLE,
    url: 'https://vimeo.com/66530',
    createdAt: '2023-11-05',
    updatedAt: '2023-11-05'
  },
  {
    id: '6',
    title: 'Second client example of how they use clickup',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.EXAMPLE,
    url: 'https://vimeo.com/64306',
    createdAt: '2023-11-06',
    updatedAt: '2023-11-06'
  },
  {
    id: '7',
    title: 'How to use decision tree for trainings',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.TRAINING,
    createdAt: '2023-11-07',
    updatedAt: '2023-11-07'
  },
  {
    id: '8',
    title: 'How to make a good SOP',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.TRAINING,
    url: 'https://vimeo.com/55921',
    createdAt: '2023-11-08',
    updatedAt: '2023-11-08'
  },
  {
    id: '9',
    title: 'The difference between training & SOPs',
    department: Department.OPERATING_SYSTEM,
    type: ResourceType.TRAINING,
    url: 'https://vimeo.com/64284',
    createdAt: '2023-11-09',
    updatedAt: '2023-11-09'
  }
];

const strategyResources: Resource[] = [
  {
    id: '10',
    title: 'Blue Ocean Strategy',
    department: Department.STRATEGY,
    type: ResourceType.SOP,
    createdAt: '2023-11-10',
    updatedAt: '2023-11-10'
  },
  {
    id: '11',
    title: 'Pie Equation',
    department: Department.STRATEGY,
    type: ResourceType.SOP,
    url: 'https://docs.google.com',
    createdAt: '2023-11-11',
    updatedAt: '2023-11-11'
  },
  {
    id: '12',
    title: '7 Figure Calculator',
    department: Department.STRATEGY,
    type: ResourceType.TEMPLATE,
    createdAt: '2023-11-12',
    updatedAt: '2023-11-12'
  },
  {
    id: '13',
    title: 'How to Increase the Valuation of Your Business',
    department: Department.STRATEGY,
    type: ResourceType.TRAINING,
    createdAt: '2023-11-13',
    updatedAt: '2023-11-13'
  },
  {
    id: '14',
    title: 'Capacity Equation',
    department: Department.STRATEGY,
    type: ResourceType.TRAINING,
    url: 'https://vimeo.com/58140',
    createdAt: '2023-11-14',
    updatedAt: '2023-11-14'
  },
  {
    id: '15',
    title: 'Current State Org Chart',
    department: Department.STRATEGY,
    type: ResourceType.TEMPLATE,
    url: 'https://vimeo.com/67342',
    createdAt: '2023-11-15',
    updatedAt: '2023-11-15'
  }
];

const customerSuccessResources: Resource[] = [
  {
    id: '16',
    title: 'Holding an Effective Kickoff Call',
    department: Department.CUSTOMER_SUCCESS,
    type: ResourceType.SOP,
    url: 'https://docs.google.com',
    createdAt: '2023-11-16',
    updatedAt: '2023-11-16'
  },
  {
    id: '17',
    title: 'Create an Onboarding Checklist (Once a Deal Is Closed)',
    department: Department.CUSTOMER_SUCCESS,
    type: ResourceType.SOP,
    createdAt: '2023-11-17',
    updatedAt: '2023-11-17'
  },
  {
    id: '18',
    title: 'OverWatch Process (Customer Success Map)',
    department: Department.CUSTOMER_SUCCESS,
    type: ResourceType.SOP,
    url: 'https://docs.google.com',
    createdAt: '2023-11-18',
    updatedAt: '2023-11-18'
  },
  {
    id: '19',
    title: 'LTV Podcast With Fellow Client Jeremy Epperson',
    department: Department.CUSTOMER_SUCCESS,
    type: ResourceType.TRAINING,
    url: 'https://open.spotify.com',
    createdAt: '2023-11-19',
    updatedAt: '2023-11-19'
  },
  {
    id: '20',
    title: 'Share Wins With Clients Monthly to retain them',
    department: Department.CUSTOMER_SUCCESS,
    type: ResourceType.SOP,
    createdAt: '2023-11-20',
    updatedAt: '2023-11-20'
  }
];

// Combine all resources
const allResources = [...osResources, ...strategyResources, ...customerSuccessResources];

export default function OperatingSystemCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter resources based on search, department, and type
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || resource.department === selectedDepartment;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesDepartment && matchesType;
  });

  // Group resources by department for the tabbed view
  const resourcesByDepartment = filteredResources.reduce((acc, resource) => {
    const dept = resource.department;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(resource);
    return acc;
  }, {} as Record<Department, Resource[]>);

  const getDepartmentBadge = (department: Department) => {
    return (
      <Badge 
        className={`${departmentColors[department]} text-white`}
      >
        {department}
      </Badge>
    );
  };

  const getResourceTypeIcon = (type: ResourceType) => {
    switch (type) {
      case ResourceType.SOP:
        return <FileTextIcon className="h-4 w-4" />;
      case ResourceType.TRAINING:
        return <BookOpen className="h-4 w-4" />;
      case ResourceType.EXAMPLE:
        return <CheckIcon className="h-4 w-4" />;
      case ResourceType.TEMPLATE:
        return <FileIcon className="h-4 w-4" />;
      case ResourceType.VIDEO:
        return <VideoIcon className="h-4 w-4" />;
      case ResourceType.DOCUMENT:
        return <FileTextIcon className="h-4 w-4" />;
      case ResourceType.WEBINAR:
        return <Users className="h-4 w-4" />;
      default:
        return <FileTextIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operating System Catalog</h1>
          <p className="text-muted-foreground">
            Access SOPs, trainings, and resources for your complete business operating system
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="default">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create New SOP
          </Button>
          <Button variant="outline">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Resources</CardTitle>
              <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-6">
                <TabsList className="w-full border-b rounded-none justify-start overflow-x-auto">
                  <TabsTrigger value="all" className="rounded-b-none">All</TabsTrigger>
                  {Object.values(Department).map((dept) => (
                    <TabsTrigger 
                      key={dept} 
                      value={dept}
                      className="rounded-b-none flex items-center gap-2"
                    >
                      {departmentIcons[dept]}
                      {dept}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          {resource.title}
                        </TableCell>
                        <TableCell>
                          {getDepartmentBadge(resource.department)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getResourceTypeIcon(resource.type)}
                            <span>{resource.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {resource.url ? (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <FileTextIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              {Object.entries(resourcesByDepartment).map(([dept, resources]) => (
                <TabsContent key={dept} value={dept} className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell className="font-medium">
                            {resource.title}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getResourceTypeIcon(resource.type)}
                              <span>{resource.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {resource.url ? (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  <ArrowUpRight className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <FileTextIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Featured Resources</CardTitle>
            <CardDescription>
              Essential resources to build your operating system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-500 hover:bg-violet-500/20">Core OS</Badge>
                  Getting Started
                </h3>
                <div className="grid gap-2">
                  <Button variant="ghost" className="justify-start h-auto py-2" asChild>
                    <a href="#" className="flex items-start">
                      <PlayIcon className="h-4 w-4 mr-2 mt-0.5 text-violet-500" />
                      <div className="text-left">
                        <div className="font-medium">Creating an SOP Creation Strategy</div>
                        <div className="text-xs text-muted-foreground">Learn how to structure your operating system</div>
                      </div>
                    </a>
                  </Button>
                  <Button variant="ghost" className="justify-start h-auto py-2" asChild>
                    <a href="#" className="flex items-start">
                      <FileTextIcon className="h-4 w-4 mr-2 mt-0.5 text-violet-500" />
                      <div className="text-left">
                        <div className="font-medium">The difference between training & SOPs</div>
                        <div className="text-xs text-muted-foreground">Understanding how to use each effectively</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-300/20 text-orange-500 hover:bg-orange-300/30">Strategy</Badge>
                  Growth Planning
                </h3>
                <div className="grid gap-2">
                  <Button variant="ghost" className="justify-start h-auto py-2" asChild>
                    <Link href="/business-strategy" className="flex items-start">
                      <FileTextIcon className="h-4 w-4 mr-2 mt-0.5 text-orange-500" />
                      <div className="text-left">
                        <div className="font-medium">Blue Ocean Strategy</div>
                        <div className="text-xs text-muted-foreground">Create uncontested market space</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start h-auto py-2" asChild>
                    <Link href="/business-strategy?tab=capacity-equation" className="flex items-start">
                      <FileTextIcon className="h-4 w-4 mr-2 mt-0.5 text-orange-500" />
                      <div className="text-left">
                        <div className="font-medium">Capacity Equation</div>
                        <div className="text-xs text-muted-foreground">Know when to hire based on data</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-300/20 text-blue-500 hover:bg-blue-300/30">Customer Success</Badge>
                  Client Management
                </h3>
                <div className="grid gap-2">
                  <Button variant="ghost" className="justify-start h-auto py-2" asChild>
                    <a href="#" className="flex items-start">
                      <FileTextIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">Holding an Effective Kickoff Call</div>
                        <div className="text-xs text-muted-foreground">Start client relationships right</div>
                      </div>
                    </a>
                  </Button>
                  <Button variant="ghost" className="justify-start h-auto py-2" asChild>
                    <a href="#" className="flex items-start">
                      <FileTextIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">Client Onboarding Checklist</div>
                        <div className="text-xs text-muted-foreground">Systemize your onboarding process</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Resources</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}