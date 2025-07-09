import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allNavigation, businessEntities, NavItem, NavSection } from '../lib/navigation';

interface MobileNavigationProps {
  onClose: () => void;
}

export default function MobileNavigation({ onClose }: MobileNavigationProps) {
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle)
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };
  
  const isExpanded = (sectionTitle: string) => {
    return expandedSections.includes(sectionTitle);
  };
  
  const isActive = (href: string) => {
    return href === location || location.startsWith(href + '/');
  };
  
  return (
    <ScrollArea className="flex-1 overflow-auto">
      <div className="py-2 px-1">
        {/* Business Entity Selector */}
        <div className="px-3 mb-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="business-entities" className="border-0">
              <AccordionTrigger className="py-2 px-3 text-sm font-medium bg-muted/50 rounded-lg">
                Switch Business Entity
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 space-y-1 pl-2">
                  {businessEntities.map((entity) => (
                    <Link
                      key={entity.id}
                      href={`/entity/${entity.slug}`}
                      onClick={onClose}
                    >
                      <div className="flex items-center py-1.5 px-3 text-sm rounded-md hover:bg-muted/80">
                        <div 
                          className="w-4 h-4 rounded-sm mr-2 bg-primary/20 text-primary/80 flex items-center justify-center text-[10px] font-semibold"
                        >
                          {entity.shortName?.charAt(0) || entity.name.charAt(0)}
                        </div>
                        <span>{entity.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Navigation Items */}
        <div className="space-y-1">
          {allNavigation.map((section: NavSection) => (
            <div key={section.title} className="mb-3">
              {/* Section Header */}
              {section.title === 'Dashboard' ? (
                // Dashboard doesn't need an expandable section
                <Link href="/" onClick={onClose}>
                  <div className={cn(
                    "flex items-center py-2 px-3 rounded-md text-sm font-medium",
                    isActive('/') ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                  )}>
                    {section.icon && <section.icon className="w-4 h-4 mr-2" />}
                    <span>Dashboard</span>
                  </div>
                </Link>
              ) : (
                // Expandable section for other categories
                <div className="border-t pt-3 mt-1 first:border-t-0 first:pt-0 first:mt-0">
                  <div 
                    className="flex items-center justify-between py-1.5 px-3 cursor-pointer text-sm font-semibold text-muted-foreground"
                    onClick={() => toggleSection(section.title)}
                  >
                    <div className="flex items-center">
                      {section.icon && <section.icon className="w-4 h-4 mr-2" />}
                      <span>{section.title}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {isExpanded(section.title) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  
                  {/* Section Items */}
                  {isExpanded(section.title) && (
                    <div className="mt-1 space-y-1">
                      {section.items.map((item: NavItem) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                        >
                          <div 
                            className={cn(
                              "flex items-center justify-between py-1.5 px-3 pl-6 text-sm rounded-md",
                              isActive(item.href) ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
                            )}
                          >
                            <div className="flex items-center">
                              {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bottom Links/Actions */}
        <div className="border-t mt-4 pt-4 px-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm px-3 font-normal"
            onClick={onClose}
          >
            Close Menu
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}