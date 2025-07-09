import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Link } from 'wouter';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// These are the main navigation items with their labels, paths, and badges
const navigationItems = [
  { name: 'Dashboard', path: '/', badge: null },
  { name: 'Business Entities', path: '/entity-dashboards', badge: null },
  { name: 'Operations', path: '/business-operations', badge: null },
  { name: 'Financial', path: '/financial-health', badge: null },
  { name: 'Business Valuation', path: '/business-valuation', badge: 'New' },
  { name: 'Profit & Loss', path: '/profit-loss', badge: 'New' },
  { name: 'Sales Dashboard', path: '/sales-dashboard', badge: 'New' },
  { name: 'Omni-Channel Sales', path: '/omni-channel-sales', badge: 'New' },
  { name: 'Marketing', path: '/campaigns', badge: null },
  { name: 'Email Marketing', path: '/email-marketing', badge: 'New' },
  { name: 'Social Media', path: '/social-media', badge: null },
  { name: 'SEO Intelligence', path: '/seo-intelligence', badge: 'New' },
  { name: 'Agency Killer', path: '/agency-killer', badge: 'New' },
  { name: 'Intelligence', path: '/personalization', badge: 'New' },
  { name: 'Smart Recommendations', path: '/recommendations', badge: 'New' },
  { name: 'Predictive Insights', path: '/predictive-insights', badge: 'New' },
  { name: 'Customer Support', path: '/customer-service', badge: null },
  { name: 'Customer Feedback', path: '/customer-feedback', badge: 'New' },
  { name: 'Customer Segments', path: '/customer-segments', badge: 'New' },
  { name: 'Partner Portal', path: '/partner-portal', badge: 'Premium' },
];

const TabletMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed position button for tablet/mobile - always visible */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="default"
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-white"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-8 w-8" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Sheet component that slides in from the left */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-[350px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">DMPHQ Navigation</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <Separator className="my-3" />
          
          <nav className="space-y-1 mt-4">
            {navigationItems.map((item, index) => (
              <div key={index} className="py-1">
                <Link href={item.path}>
                  <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge variant={item.badge === 'Premium' ? 'outline' : 'default'} className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </nav>
          
          <Separator className="my-4" />
          
          <div className="px-3 py-2">
            <p className="text-sm text-muted-foreground mb-2">Business Entities</p>
            <div className="space-y-1">
              <Link href="/entity-dashboards?entity=dmp">
                <div className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  Digital Merch Pros
                </div>
              </Link>
              <Link href="/entity-dashboards?entity=mystery-hype">
                <div className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  Mystery Hype
                </div>
              </Link>
              <Link href="/entity-dashboards?entity=lone-star">
                <div className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  Lone Star Custom Clothing
                </div>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TabletMenu;