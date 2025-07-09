import { ReactNode } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  pageType?: string;
  estimatedAvailability?: string;
}

export default function PlaceholderPage({
  title,
  description,
  icon,
  pageType = "Information Page",
  estimatedAvailability = "Coming Soon"
}: PlaceholderPageProps) {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight mb-1">{title}</h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                {description || `This page will contain information about ${title}.`}
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {estimatedAvailability}
            </Badge>
          </div>
          
          {/* Content Card */}
          <Card className="border-2 border-dashed">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                {icon || <HelpCircle className="h-5 w-5 text-muted-foreground" />}
                <CardTitle>{pageType}</CardTitle>
              </div>
              <CardDescription>
                This page is under development and will be available soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-8">
              <div className="max-w-lg space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {icon || <HelpCircle className="h-8 w-8 text-primary" />}
                </div>
                <h3 className="text-xl font-semibold">Page Under Construction</h3>
                <p className="text-muted-foreground">
                  We're currently working on this page to provide you with the best possible experience.
                  Check back soon for updates.
                </p>
                <div className="pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Visit Help Center
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Content */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h3 className="text-sm font-medium mb-2">Why are we building this page?</h3>
            <p className="text-sm text-muted-foreground">
              This page is part of our ongoing efforts to improve DMPHQ and provide a comprehensive 
              business execution platform. We value your feedback as we develop additional features.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}