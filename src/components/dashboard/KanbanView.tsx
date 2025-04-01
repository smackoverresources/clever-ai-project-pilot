
import { useState } from "react";
import { Task } from "@/lib/dummy-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface KanbanViewProps {
  tasks: Task[];
}

const KanbanView = ({ tasks: initialTasks }: KanbanViewProps) => {
  const [tasks] = useState<Task[]>(initialTasks);
  
  const columns = [
    { id: "todo", title: "To Do", status: "To Do" },
    { id: "progress", title: "In Progress", status: "In Progress" },
    { id: "done", title: "Done", status: "Done" },
    { id: "blocked", title: "Blocked", status: "Blocked" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-slate-400 hover:bg-slate-500";
      case "Medium": return "bg-blue-400 hover:bg-blue-500";
      case "High": return "bg-orange-400 hover:bg-orange-500";
      default: return "bg-slate-400 hover:bg-slate-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">{column.title}</h3>
            <Badge variant="outline" className="text-xs">
              {tasks.filter(t => t.status === column.status).length}
            </Badge>
          </div>
          
          <div className="flex flex-col gap-3 min-h-[200px]">
            {tasks
              .filter(task => task.status === column.status)
              .map((task) => (
                <Card key={task.id} className="card-hover">
                  <CardHeader className="p-4 pb-2">
                    <Badge className={`${getPriorityColor(task.priority)} mb-2 self-start`}>
                      {task.priority}
                    </Badge>
                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                    <CardDescription className="text-xs mt-1 line-clamp-2">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    {task.assignee && (
                      <div className="mt-2 flex items-center">
                        <div className="w-5 h-5 rounded-full bg-pm-blue-100 text-pm-blue-500 flex items-center justify-center text-[10px] font-medium mr-2">
                          {task.assignee.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {task.assignee}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-2 flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(task.dueDate)}
                    </div>
                    {task.estimatedHours && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimatedHours}h
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
