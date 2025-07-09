import PlaceholderPage from "./PlaceholderPage";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Contact Us"
      description="Get in touch with our team for support, feedback, or business inquiries."
      icon={<Mail className="h-5 w-5" />}
      pageType="Contact Information"
      estimatedAvailability="Available Now"
    />
  );
}