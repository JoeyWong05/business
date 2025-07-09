import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
  iconColor: string;
  toolCount: number;
  monthlyCost: number;
}

export default function CategoryCard({ name, slug, icon, iconColor, toolCount, monthlyCost }: CategoryCardProps) {
  // Determine cost level for visual cue
  const getCostBadgeVariant = () => {
    if (monthlyCost === 0) return "outline";
    if (monthlyCost < 50) return "secondary";
    if (monthlyCost < 200) return "default";
    return "destructive";
  };

  // Calculate progress value (for illustration purposes)
  // In a real scenario, you might want to compare against a budget or benchmark
  const progressValue = Math.min(100, (monthlyCost / 500) * 100);

  return (
    <Link href={`/category/${slug}`} className="block w-full">
      <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer`}>
        <div className={`h-1.5 w-full bg-${iconColor.replace("text-", "")}`} />
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full bg-${iconColor.replace("text-", "")}/10 flex items-center justify-center mr-3`}>
                <span className={`material-icons ${iconColor}`}>{icon}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
            </div>
            <Badge variant={getCostBadgeVariant()}>
              ${monthlyCost.toFixed(0)}/mo
            </Badge>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Monthly spend</span>
              <span className="font-medium">${monthlyCost.toFixed(2)}</span>
            </div>
            <Progress value={progressValue} className="h-1.5" />
            
            <div className="flex justify-between items-center text-sm mt-3">
              <span className="text-gray-500 dark:text-gray-400">
                {toolCount > 0 ? (
                  <>{toolCount} {toolCount === 1 ? 'tool' : 'tools'} in stack</>
                ) : (
                  <>No tools added yet</>
                )}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ${(monthlyCost * 12).toFixed(0)}/year
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <div className="w-full text-center py-3 text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
            View & Manage Tools
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
