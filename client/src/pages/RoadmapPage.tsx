import PlaceholderPage from "./PlaceholderPage";
import { Map } from "lucide-react";

export default function RoadmapPage() {
  return (
    <PlaceholderPage
      title="Product Roadmap"
      description="See what's coming next for DMPHQ and our planned feature releases."
      icon={<Map className="h-5 w-5" />}
      pageType="Product Planning"
      estimatedAvailability="Coming in Q2 2024"
    />
  );
}