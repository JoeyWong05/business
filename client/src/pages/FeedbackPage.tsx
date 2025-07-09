import PlaceholderPage from "./PlaceholderPage";
import { MessageSquareText } from "lucide-react";

export default function FeedbackPage() {
  return (
    <PlaceholderPage
      title="Send Feedback"
      description="We value your input. Share your thoughts, suggestions, and feature requests with our team."
      icon={<MessageSquareText className="h-5 w-5" />}
      pageType="Feedback Form"
      estimatedAvailability="Available Now"
    />
  );
}