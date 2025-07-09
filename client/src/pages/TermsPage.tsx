import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <PlaceholderPage
      title="Terms of Service"
      description="Read our terms of service agreement that governs the use of DMPHQ."
      icon={<FileText className="h-5 w-5" />}
      pageType="Legal Documentation"
      estimatedAvailability="Available Now"
    />
  );
}