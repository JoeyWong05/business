import PlaceholderPage from "./PlaceholderPage";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="Privacy Policy"
      description="Learn how we collect, use, and protect your personal information in DMPHQ."
      icon={<Shield className="h-5 w-5" />}
      pageType="Legal Documentation"
      estimatedAvailability="Available Now"
    />
  );
}