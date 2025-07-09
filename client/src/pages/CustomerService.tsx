import GorgiasIntegration from "@/components/GorgiasIntegration";
import MainLayout from "@/components/MainLayout";

export default function CustomerService() {
  return (
    <MainLayout
      title="Customer Service"
      description="View and manage all customer service tickets across your business entities"
    >
      <GorgiasIntegration />
    </MainLayout>
  );
}