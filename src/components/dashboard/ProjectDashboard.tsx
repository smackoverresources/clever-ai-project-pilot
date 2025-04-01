
import { useState } from "react";
import { Project } from "@/lib/dummy-data";
import ProjectViewSelector from "./ProjectViewSelector";
import KanbanView from "./KanbanView";
import CalendarView from "./CalendarView";
import ListView from "./ListView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, DollarSign, Clock, Users } from "lucide-react";

interface ProjectDashboardProps {
  project: Project;
}

const ProjectDashboard = ({ project }: ProjectDashboardProps) => {
  const [activeView, setActiveView] = useState("kanban");

  // Calculate project metrics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(t => t.status === "Done").length;
  const totalHours = project.tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const laborCost = totalHours * (project.laborRate || 0);
  
  // Format the date range
  const formatDateRange = () => {
    const start = new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const end = new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${start} - ${end}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <ProjectViewSelector activeView={activeView} onViewChange={setActiveView} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Project Timeline</CardDescription>
              <CardTitle className="text-lg flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-pm-blue-500" />
                {formatDateRange()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Project Budget</CardDescription>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                ${project.budget?.toLocaleString() || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Est. labor: ${laborCost.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Estimated Time</CardDescription>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-500" />
                {totalHours} hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Labor rate: ${project.laborRate}/hr
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Team Members</CardDescription>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-4 w-4 mr-2 text-indigo-500" />
                {project.team?.length || 0} members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.team?.join(", ") || "No team members"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {activeView === "kanban" && <KanbanView tasks={project.tasks} />}
      {activeView === "calendar" && <CalendarView tasks={project.tasks} />}
      {activeView === "list" && <ListView tasks={project.tasks} />}
    </div>
  );
};

export default ProjectDashboard;
