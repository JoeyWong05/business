import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoMode } from '@/contexts/DemoModeContext';

export interface Brand {
  id: string;
  name: string;
  primaryColor: string;
  description: string;
}

export interface BrandSwitcherProps {
  className?: string;
}

const BrandSwitcher: React.FC<BrandSwitcherProps> = ({ className }) => {
  const { activeBrand, brands, setActiveBrand } = useDemoMode();

  const handleBrandChange = (brandId: string) => {
    const selectedBrand = brands.find(brand => brand.id === brandId);
    if (selectedBrand) {
      setActiveBrand(selectedBrand);
    }
  };

  // Add null check for activeBrand to prevent crashes
  if (!activeBrand || !brands || brands.length === 0) {
    return (
      <div className={className}>
        <div className="w-[240px] md:w-[280px] h-10 bg-muted/30 rounded flex items-center px-3">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Select value={activeBrand?.id || ''} onValueChange={handleBrandChange}>
        <SelectTrigger 
          className="w-[240px] md:w-[280px] bg-background border-none hover:bg-muted/50 focus:ring-0"
          style={{
            boxShadow: `inset 3px 0 0 ${activeBrand?.primaryColor || '#888'}`,
            paddingLeft: '14px',
          }}
        >
          <SelectValue placeholder="Select brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Business Entities</SelectLabel>
            {brands.map((brand) => (
              <SelectItem 
                key={brand.id} 
                value={brand.id}
                className="relative pl-8 focus:bg-muted/50"
              >
                <span 
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: brand.primaryColor }}
                ></span>
                {brand.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BrandSwitcher;