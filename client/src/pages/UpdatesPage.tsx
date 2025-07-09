import PlaceholderPage from "./PlaceholderPage";
import { Bell } from "lucide-react";

export default function UpdatesPage() {
  return (
    <PlaceholderPage
      title="Product Updates"
      description="Stay informed about the latest features, improvements, and bug fixes in DMPHQ."
      icon={<Bell className="h-5 w-5" />}
      pageType="Release Notes"
      estimatedAvailability="Available Now"
    />
  );
}