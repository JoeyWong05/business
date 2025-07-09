import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Rocket, Zap, Star, LucideIcon } from "lucide-react";

export interface ComingSoonFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ComingSoonCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features?: ComingSoonFeature[];
  estimatedRelease?: string;
  priority?: "high" | "medium" | "low";
  onNotifyClick?: () => void;
  onSuggestFeatureClick?: () => void;
}

export function ComingSoonCard({
  title,
  description,
  icon,
  features = [],
  estimatedRelease,
  priority = "medium",
  onNotifyClick,
  onSuggestFeatureClick,
}: ComingSoonCardProps) {
  const getPriorityBadge = () => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">High Priority</Badge>
        );
      case "medium":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Medium Priority</Badge>
        );
      case "low":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Low Priority</Badge>
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/5 p-2 absolute right-3 top-3 rounded-full">
        <Rocket className="h-5 w-5 text-primary" />
      </div>
      <div className="bg-primary/10 py-4 px-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-background rounded-full p-2 h-10 w-10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl flex items-center">
              {title}
              <Badge variant="outline" className="ml-2 bg-primary/20 text-primary border-primary/30">
                Coming Soon
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </div>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {estimatedRelease && (
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Estimated Release:</span>
              <span className="font-medium">{estimatedRelease}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Priority:</span>
            <span>{getPriorityBadge()}</span>
          </div>
        </div>

        {features.length > 0 && (
          <>
            <div className="mt-6 mb-3">
              <h3 className="text-sm font-medium flex items-center">
                <Star className="h-4 w-4 text-primary mr-1" />
                Planned Features
              </h3>
            </div>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                    <feature.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 bg-muted/30 py-3 px-6">
        {onNotifyClick && (
          <Button onClick={onNotifyClick} variant="outline" className="w-full sm:w-auto">
            Notify Me When Released
          </Button>
        )}
        {onSuggestFeatureClick && (
          <Button
            onClick={onSuggestFeatureClick}
            variant="default"
            className="w-full sm:w-auto"
          >
            Suggest Features
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}