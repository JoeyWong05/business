import PlaceholderPage from "./PlaceholderPage";
import { Handshake } from "lucide-react";

export default function PartnersPage() {
  return (
    <PlaceholderPage
      title="Partners"
      description="Learn about our strategic partners and integration ecosystem that helps power DMPHQ."
      icon={<Handshake className="h-5 w-5" />}
      pageType="Partner Directory"
      estimatedAvailability="Coming in Q3 2024"
    />
  );
}