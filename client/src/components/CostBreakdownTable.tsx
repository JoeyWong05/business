import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Info } from "lucide-react";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolCostItem {
  id: number;
  name: string;
  category: string;
  monthlyPrice: number;
  businessEntityId: number | null;
  businessEntityName?: string;
}

interface CostBreakdownTableProps {
  data: ToolCostItem[];
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  showEntities?: boolean;
  title?: string;
  limit?: number;
}

export default function CostBreakdownTable({
  data,
  timeframe = 'monthly',
  showEntities = true,
  title = "Cost Breakdown",
  limit
}: CostBreakdownTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Factor to multiply monthly price by based on timeframe
  const timeFactor = {
    daily: 1/30,
    weekly: 12/52,
    monthly: 1,
    yearly: 12
  };

  // Format the displayed timeframe
  const timeframeLabel = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === 'asc'
        ? a.monthlyPrice - b.monthlyPrice
        : b.monthlyPrice - a.monthlyPrice;
    }
  });

  // Limit data if needed
  const displayData = limit ? sortedData.slice(0, limit) : sortedData;
  
  // Calculate total cost
  const totalCost = displayData.reduce((sum, item) => sum + item.monthlyPrice, 0) * timeFactor[timeframe];

  // Toggle sort
  const toggleSort = (column: 'name' | 'price') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  // Group expenses by entity when showing entities
  const groupedByEntity = displayData.reduce((acc, item) => {
    const entityId = item.businessEntityId || 'unassigned';
    const entityName = item.businessEntityName || 'Unassigned';
    
    if (!acc[entityId]) {
      acc[entityId] = {
        name: entityName,
        tools: [],
        totalCost: 0
      };
    }
    
    acc[entityId].tools.push(item);
    acc[entityId].totalCost += item.monthlyPrice;
    
    return acc;
  }, {} as Record<string | number, { name: string, tools: ToolCostItem[], totalCost: number }>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-2">
            {timeframeLabel[timeframe]}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showEntities ? (
          <>
            <Table>
              <TableCaption>
                Total {timeframeLabel[timeframe]} Cost: ${totalCost.toFixed(2)}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort('name')}>
                      Entity
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Tools</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end cursor-pointer" onClick={() => toggleSort('price')}>
                      {timeframeLabel[timeframe]} Cost
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(groupedByEntity).map((entity) => (
                  <TableRow key={entity.name}>
                    <TableCell className="font-medium">{entity.name}</TableCell>
                    <TableCell>{entity.tools.length}</TableCell>
                    <TableCell className="text-right">
                      ${(entity.totalCost * timeFactor[timeframe]).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Breakdown by Tool</h4>
            </div>
          </>
        ) : null}
        <Table>
          {!showEntities && (
            <TableCaption>
              Total {timeframeLabel[timeframe]} Cost: ${totalCost.toFixed(2)}
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort('name')}>
                  Tool Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              {showEntities && <TableHead>Entity</TableHead>}
              <TableHead className="text-right">
                <div className="flex items-center justify-end cursor-pointer" onClick={() => toggleSort('price')}>
                  {timeframeLabel[timeframe]} Cost
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {item.name}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1 text-xs">
                            <p>Monthly: ${item.monthlyPrice.toFixed(2)}</p>
                            <p>Yearly: ${(item.monthlyPrice * 12).toFixed(2)}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-sm font-normal">
                    {item.category}
                  </Badge>
                </TableCell>
                {showEntities && (
                  <TableCell>
                    {item.businessEntityName || 'Unassigned'}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  ${(item.monthlyPrice * timeFactor[timeframe]).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}