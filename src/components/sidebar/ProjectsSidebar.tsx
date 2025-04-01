
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SAMPLE_PROJECTS, Project, ProjectStatus } from "@/lib/dummy-data";

interface ProjectsSidebarProps {
  onProjectSelect: (project: Project) => void;
  onNewProject: () => void;
  activeProjectId?: string;
}

const ProjectsSidebar = ({ 
  onProjectSelect, 
  onNewProject,
  activeProjectId 
}: ProjectsSidebarProps) => {
  const [projects] = useState<Project[]>(SAMPLE_PROJECTS);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "Not Started": return "bg-slate-400";
      case "In Progress": return "bg-pm-blue-400";
      case "Completed": return "bg-green-500";
      case "On Hold": return "bg-amber-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-sidebar-foreground">Projects</h3>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-3 py-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project)}
                className={`w-full text-left mb-2 p-3 rounded-md transition-colors ${
                  activeProjectId === project.id 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{project.title}</span>
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${getStatusColor(project.status)}`}></span>
                </div>
                <p className="text-xs text-sidebar-foreground/70 truncate mt-1">{project.description}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          onClick={onNewProject}
          className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ProjectsSidebar;
