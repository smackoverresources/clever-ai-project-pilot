
import { Button } from "@/components/ui/button";
import { VIEW_TYPES } from "@/lib/dummy-data";
import { LucideIcon } from "lucide-react";

interface ProjectViewSelectorProps {
  activeView: string;
  onViewChange: (viewId: string) => void;
}

const ProjectViewSelector = ({
  activeView,
  onViewChange,
}: ProjectViewSelectorProps) => {
  return (
    <div className="flex space-x-2">
      {VIEW_TYPES.map((view) => {
        const Icon = view.icon as LucideIcon;
        return (
          <Button
            key={view.id}
            variant={activeView === view.id ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className="flex items-center"
          >
            <Icon className="h-4 w-4 mr-2" />
            {view.name}
          </Button>
        );
      })}
    </div>
  );
};

export default ProjectViewSelector;
