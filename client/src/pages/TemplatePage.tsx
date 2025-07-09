import { useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TemplatePageProps {
  title: string;
  description: string;
  pageName: string;
  icon?: React.ReactNode;
  isComingSoon?: boolean;
}

export default function TemplatePage({ 
  title, 
  description, 
  pageName, 
  icon, 
  isComingSoon = false 
}: TemplatePageProps) {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout title={title} description={description}>
      <div className="mt-4 space-y-4">
        <Card className="border shadow-sm">
          <CardHeader className="relative">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              {isComingSoon && (
                <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
              <div className="text-4xl text-gray-300 mb-4">
                {icon}
              </div>
              
              {isComingSoon ? (
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-2">This feature is under development</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    We're working hard to bring you the {pageName.toLowerCase()} feature. 
                    Please check back soon for updates.
                  </p>
                  <Button variant="outline" className="mt-2">
                    Request early access
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-2">Welcome to {pageName}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    This is a placeholder for the {pageName.toLowerCase()} page. 
                    Customize this content according to your specific needs.
                  </p>
                  <Button className="mt-2">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}