import EntitySpecificView from "@/components/EntitySpecificView";
import MainLayout from "@/components/MainLayout";

export default function EntityDashboards() {
  return (
    <MainLayout
      title="Entity Dashboards"
      description="View customized dashboards for each business entity based on their specific business model"
    >
      <EntitySpecificView />
    </MainLayout>
  );
}