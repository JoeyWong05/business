import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, Store, PenTool, ShoppingBag, Info } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function PrintOnDemand() {
  const { demoMode } = useDemoMode();
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Print on Demand</h1>
          <p className="text-muted-foreground">
            Launch your own custom merchandise business with our in-house print capabilities
          </p>
        </div>
        
        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid grid-cols-5 w-full md:w-[750px]">
            <TabsTrigger value="catalog">
              <Shirt className="h-4 w-4 mr-2" />
              Product Catalog
            </TabsTrigger>
            <TabsTrigger value="my-store">
              <Store className="h-4 w-4 mr-2" />
              My Store
            </TabsTrigger>
            <TabsTrigger value="designs">
              <PenTool className="h-4 w-4 mr-2" />
              My Designs
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="how-it-works">
              <Info className="h-4 w-4 mr-2" />
              How It Works
            </TabsTrigger>
          </TabsList>
          
          {/* Simple Content for each tab */}
          <TabsContent value="catalog">
            <Card>
              <CardHeader>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>Browse our selection of customizable products</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our product catalog is being updated. Check back soon to see our full selection of customizable merchandise.</p>
                <Button className="mt-4">Learn More</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-store">
            <Card>
              <CardHeader>
                <CardTitle>My Store</CardTitle>
                <CardDescription>Set up and customize your online merchandise store</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Easily create your branded online store with our simple setup process.</p>
                <Button className="mt-4">Create Store</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="designs">
            <Card>
              <CardHeader>
                <CardTitle>My Designs</CardTitle>
                <CardDescription>Upload and manage your print-ready artwork</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Upload your designs or work with our design team to create custom artwork.</p>
                <Button className="mt-4">Upload Design</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Track and manage your print on demand orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Once you've set up your store and received orders, they'll appear here.</p>
                <Button className="mt-4">View Details</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="how-it-works">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Our simple process to launch your merchandise business</CardDescription>
              </CardHeader>
              <CardContent>
                <p>1. Create your store<br />
                2. Upload designs<br />
                3. We print and ship your products</p>
                <Button className="mt-4">Schedule Consultation</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}