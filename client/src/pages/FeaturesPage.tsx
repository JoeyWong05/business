import PlaceholderPage from "./PlaceholderPage";
import { ListChecks } from "lucide-react";

export default function FeaturesPage() {
  return (
    <PlaceholderPage
      title="Features"
      description="Explore the comprehensive features and capabilities of the DMPHQ platform."
      icon={<ListChecks className="h-5 w-5" />}
      pageType="Product Information"
      estimatedAvailability="Available Now"
    />
  );
}