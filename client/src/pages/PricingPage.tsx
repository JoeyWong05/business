import PlaceholderPage from "./PlaceholderPage";
import { DollarSign } from "lucide-react";

export default function PricingPage() {
  return (
    <PlaceholderPage
      title="Pricing"
      description="View our transparent pricing options for businesses of all sizes."
      icon={<DollarSign className="h-5 w-5" />}
      pageType="Pricing Information"
      estimatedAvailability="Available Now"
    />
  );
}