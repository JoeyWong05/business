import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import SaasLayout from "@/components/SaasLayout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AiOutlineStar, AiOutlineClockCircle, AiOutlineVideoCamera } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VideoEmbed from "@/components/VideoEmbed";
import { Skeleton } from "@/components/ui/skeleton";

interface SOPDetailProps {
  params: {
    id: string;
  };
}

export default function SOPDetail({ params }: SOPDetailProps) {
  const id = parseInt(params.id, 10);
  
  const { data: sop, isLoading, error } = useQuery({
    queryKey: ['/api/sops', id],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Get category details for the SOP
  const { data: category } = useQuery({
    queryKey: ['/api/categories', sop?.categoryId],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!sop?.categoryId,
  });

  // Format date
  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <SaasLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-48 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </SaasLayout>
    );
  }

  if (error || !sop) {
    return (
      <SaasLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">The requested SOP could not be found</h2>
          <p className="mb-6">The SOP you're looking for may have been removed or does not exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </SaasLayout>
    );
  }

  return (
    <SaasLayout>
      <div className="space-y-6">
        {/* SOP Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold">{sop.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {category?.category && (
                <Badge className={`${category.category.color} bg-opacity-10 border-0`}>
                  {category.category.name}
                </Badge>
              )}
              {sop.isAiGenerated && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <AiOutlineStar className="mr-1" /> AI Generated
                </Badge>
              )}
              {sop.videoUrl && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <AiOutlineVideoCamera className="mr-1" /> Video Demonstration
                </Badge>
              )}
              <span className="text-sm text-gray-500 flex items-center">
                <AiOutlineClockCircle className="mr-1" /> Created {getFormattedDate(sop.createdAt)}
              </span>
            </div>
          </div>
          <Button onClick={() => window.print()}>Print SOP</Button>
        </div>
        
        {/* Video Demonstration */}
        {sop.videoUrl && (
          <div className="my-6">
            <h2 className="text-xl font-semibold mb-3">Video Demonstration</h2>
            <VideoEmbed 
              videoUrl={sop.videoUrl} 
              videoType={sop.videoType || "loom"} 
              title={`${sop.title} - Video Demonstration`}
              height={450}
            />
          </div>
        )}
        
        {/* Content */}
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <div className="prose max-w-none">
            <p>{sop.content}</p>
          </div>
        </div>
        
        <Separator />
        
        {/* Steps */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Procedure Steps</h2>
          <div className="space-y-4">
            {sop.steps.map((step, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{step.title}</h3>
                      <p className="mt-2 text-gray-700">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Business Entity Info (if applicable) */}
        {sop.businessEntityId && (
          <div className="bg-gray-50 p-4 rounded-md mt-8">
            <p className="text-sm text-gray-500">
              This SOP belongs to {sop.businessEntityName || "your business entity"}.
            </p>
          </div>
        )}
      </div>
    </SaasLayout>
  );
}