import TemplatePage from "./TemplatePage";
import { Layers } from "lucide-react";

export default function CategoriesOverview() {
  return (
    <TemplatePage
      title="Categories Overview"
      description="View and manage all business categories and their tools"
      pageName="Categories Overview"
      icon={<Layers className="h-12 w-12" />}
    />
  );
}