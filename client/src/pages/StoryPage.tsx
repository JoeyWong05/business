import PlaceholderPage from "./PlaceholderPage";
import { History } from "lucide-react";

export default function StoryPage() {
  return (
    <PlaceholderPage
      title="Our Story"
      description="Discover the journey of DMPHQ from its inception to becoming a leading business execution platform."
      icon={<History className="h-5 w-5" />}
      pageType="Company History"
      estimatedAvailability="Coming in Q2 2024"
    />
  );
}