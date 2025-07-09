import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import SOPBuilder, { GeneratedSop } from "@/components/SOPBuilder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Filter, SortDesc, Clock, ListChecks } from "lucide-react";

export default function SOPBuilderPage() {
  const [recentSops, setRecentSops] = useState<GeneratedSop[]>([]);
  const { toast } = useToast();

  const handleSopGenerated = (sop: GeneratedSop) => {
    setRecentSops(prev => [sop, ...prev]);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI-Powered SOP Builder</h1>
        <p className="text-muted-foreground">
          Create comprehensive, detailed Standard Operating Procedures in minutes using our AI assistant.
        </p>
      </div>

      <Tabs defaultValue="build">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="build" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Build New SOP</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>SOP Library {recentSops.length > 0 && `(${recentSops.length})`}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="build">
          <SOPBuilder onSopGenerated={handleSopGenerated} />
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>SOP Library</CardTitle>
              <CardDescription>
                View, manage, and organize all your Standard Operating Procedures
              </CardDescription>
              <div className="flex items-center gap-3 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search SOPs..."
                    className="pl-9 pr-4"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon">
                  <SortDesc className="h-4 w-4" />
                  <span className="sr-only">Sort</span>
                </Button>
                <div className="hidden md:block">
                  <Button variant="outline" className="gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Recent</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recentSops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No SOPs Created Yet</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    You haven't created any Standard Operating Procedures yet. Generate your first SOP using our AI-powered builder.
                  </p>
                  <Button 
                    className="mt-6" 
                    onClick={() => {
                      const buildTabButton = document.querySelector('button[value="build"]');
                      if (buildTabButton instanceof HTMLElement) {
                        buildTabButton.click();
                      }
                    }}
                  >
                    Create Your First SOP
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {recentSops.map((sop) => (
                    <div 
                      key={sop.id} 
                      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="font-semibold">{sop.title}</h3>
                          <div className="flex gap-2">
                            <Badge variant="outline">{sop.department}</Badge>
                            <Badge variant="outline">{sop.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{sop.description}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          Created {new Date(sop.dateCreated).toLocaleDateString()} by {sop.createdBy}
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </Button>
                        <Button size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}