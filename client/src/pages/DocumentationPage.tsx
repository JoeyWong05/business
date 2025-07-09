import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function DocumentationPage() {
  return (
    <PlaceholderPage
      title="Documentation"
      description="Comprehensive guides and reference materials for using DMPHQ effectively."
      icon={<FileText className="h-5 w-5" />}
      pageType="Technical Documentation"
      estimatedAvailability="Available Now"
    />
  );
}