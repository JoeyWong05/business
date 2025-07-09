import PlaceholderPage from "./PlaceholderPage";
import { Shield, Lock } from "lucide-react";

export default function SecurityPage() {
  return (
    <PlaceholderPage
      title="Security & Compliance"
      description="Learn about our security practices, compliance certifications, and data protection measures."
      icon={<Lock className="h-5 w-5" />}
      pageType="Legal Documentation"
      estimatedAvailability="Available Now"
    />
  );
}