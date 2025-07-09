import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Plus, Save, Trash2 } from "lucide-react";

// Define data field types for mapping
interface DataField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  required: boolean;
  description?: string;
}

interface DataMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transform?: string;
}

interface DataMappingInterfaceProps {
  sourceSystem: {
    name: string;
    fields: DataField[];
  };
  targetSystem: {
    name: string;
    fields: DataField[];
  };
  initialMappings?: DataMapping[];
  onSave?: (mappings: DataMapping[]) => void;
}

export function DataMappingInterface({
  sourceSystem,
  targetSystem,
  initialMappings = [],
  onSave
}: DataMappingInterfaceProps) {
  const [mappings, setMappings] = useState<DataMapping[]>(initialMappings);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const addMapping = () => {
    const newId = `mapping-${Date.now()}`;
    setMappings([
      ...mappings,
      {
        id: newId,
        sourceField: "",
        targetField: "",
      }
    ]);
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(mapping => mapping.id !== id));
  };

  const updateMapping = (id: string, field: keyof DataMapping, value: string) => {
    setMappings(mappings.map(mapping => 
      mapping.id === id ? { ...mapping, [field]: value } : mapping
    ));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(mappings);
    }
  };

  const isSourceFieldSelected = (sourceField: string) => {
    return mappings.some(mapping => mapping.sourceField === sourceField);
  };

  const isTargetFieldSelected = (targetField: string) => {
    return mappings.some(mapping => mapping.targetField === targetField);
  };

  const getFieldLabel = (field: DataField) => {
    return `${field.name}${field.required ? ' *' : ''} (${field.type})`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Mapping Configuration</CardTitle>
        <CardDescription>
          Define how data is transferred between {sourceSystem.name} and {targetSystem.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="font-medium">{sourceSystem.name}</div>
          <ArrowRight className="h-5 w-5 mx-4 text-muted-foreground" />
          <div className="font-medium">{targetSystem.name}</div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          {mappings.map((mapping, index) => (
            <div key={mapping.id} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-5">
                <Select
                  value={mapping.sourceField}
                  onValueChange={(value) => updateMapping(mapping.id, 'sourceField', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source field" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceSystem.fields.map(field => (
                      <SelectItem 
                        key={field.id} 
                        value={field.id}
                        disabled={isSourceFieldSelected(field.id) && mapping.sourceField !== field.id}
                      >
                        {getFieldLabel(field)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {mapping.sourceField && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {sourceSystem.fields.find(f => f.id === mapping.sourceField)?.description || ""}
                  </p>
                )}
              </div>
              
              <div className="col-span-5">
                <Select
                  value={mapping.targetField}
                  onValueChange={(value) => updateMapping(mapping.id, 'targetField', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target field" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetSystem.fields.map(field => (
                      <SelectItem 
                        key={field.id} 
                        value={field.id}
                        disabled={isTargetFieldSelected(field.id) && mapping.targetField !== field.id}
                      >
                        {getFieldLabel(field)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {mapping.targetField && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {targetSystem.fields.find(f => f.id === mapping.targetField)?.description || ""}
                  </p>
                )}
              </div>
              
              <div className="col-span-2 flex items-start">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeMapping(mapping.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {showAdvanced && (
                <div className="col-span-10 col-start-1 mt-2">
                  <Label htmlFor={`transform-${mapping.id}`} className="text-xs mb-1 block">
                    Transform (JavaScript)
                  </Label>
                  <Input
                    id={`transform-${mapping.id}`}
                    value={mapping.transform || ""}
                    onChange={(e) => updateMapping(mapping.id, 'transform', e.target.value)}
                    placeholder="e.g. value.toUpperCase() or value * 100"
                    className="font-mono text-xs"
                  />
                </div>
              )}
            </div>
          ))}
          
          <Button variant="outline" className="w-full" onClick={addMapping}>
            <Plus className="h-4 w-4 mr-2" />
            Add Field Mapping
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 pt-4">
          <Switch
            id="advanced-mode"
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
          />
          <Label htmlFor="advanced-mode">Show Advanced Options</Label>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="mr-2">
          Reset
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Mapping
        </Button>
      </CardFooter>
    </Card>
  );
}