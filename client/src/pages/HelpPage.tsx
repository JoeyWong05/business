import PlaceholderPage from "./PlaceholderPage";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <PlaceholderPage
      title="Help Center"
      description="Find answers to common questions and learn how to use DMPHQ effectively."
      icon={<HelpCircle className="h-5 w-5" />}
      pageType="Support Documentation"
      estimatedAvailability="Available Now"
    />
  );
}