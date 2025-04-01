
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, DollarSign } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface WizardProps {
  onClose: () => void;
}

const ProjectWizard = ({ onClose }: WizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    budget: "",
    laborRate: "85",
    tasks: [] as { title: string; description: string; hours: string }[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    setFormData({ ...formData, [field]: date });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { title: "", description: "", hours: "" }],
    });
  };

  const updateTask = (index: number, field: string, value: string) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const handleSubmit = () => {
    // Calculate total hours and estimated costs
    const totalHours = formData.tasks.reduce((sum, task) => sum + (Number(task.hours) || 0), 0);
    const laborCost = totalHours * Number(formData.laborRate);
    
    toast({
      title: "Project Created!",
      description: `"${formData.title}" has been added to your projects with an estimated labor cost of $${laborCost.toLocaleString()}.`,
    });
    
    onClose();
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>AI Project Setup Wizard</CardTitle>
        <CardDescription>
          Let's create your project in just a few steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleDateChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Project End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(formData.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleDateChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Project Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    placeholder="Enter budget amount"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="laborRate"
                    name="laborRate"
                    type="number"
                    placeholder="Enter hourly rate"
                    value={formData.laborRate}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Tasks</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTask}>
                  Add Task
                </Button>
              </div>
              
              {formData.tasks.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  No tasks added yet. Click "Add Task" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.tasks.map((task, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`task-title-${index}`}>Task Title</Label>
                        <Input
                          id={`task-title-${index}`}
                          placeholder="Enter task title"
                          value={task.title}
                          onChange={(e) => updateTask(index, "title", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`task-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`task-desc-${index}`}
                          placeholder="Describe this task"
                          value={task.description}
                          onChange={(e) => updateTask(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`task-hours-${index}`}>Estimated Hours</Label>
                        <Input
                          id={`task-hours-${index}`}
                          type="number"
                          placeholder="Hours"
                          value={task.hours}
                          onChange={(e) => updateTask(index, "hours", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Project Summary</h3>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Project Title</h4>
                    <p className="mt-1">{formData.title}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Project Dates</h4>
                    <p className="mt-1">
                      {formData.startDate && formData.endDate ? (
                        `${format(formData.startDate, "PPP")} - ${format(formData.endDate, "PPP")}`
                      ) : (
                        "Dates not specified"
                      )}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                  <p className="mt-1">{formData.description || "No description provided"}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Budget</h4>
                    <p className="mt-1">${formData.budget ? Number(formData.budget).toLocaleString() : 0}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Labor Rate</h4>
                    <p className="mt-1">${formData.laborRate}/hour</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Tasks ({formData.tasks.length})</h3>
              {formData.tasks.length > 0 ? (
                <div className="mt-4 border rounded-md divide-y">
                  {formData.tasks.map((task, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <span>{task.hours} hours</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-muted-foreground">No tasks added</p>
              )}
              
              {formData.tasks.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <div className="flex justify-between font-medium">
                    <span>Total Estimated Hours:</span>
                    <span>
                      {formData.tasks.reduce((sum, task) => sum + (Number(task.hours) || 0), 0)} hours
                    </span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span>Estimated Labor Cost:</span>
                    <span>
                      ${(formData.tasks.reduce((sum, task) => sum + (Number(task.hours) || 0), 0) * Number(formData.laborRate)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        
        {step < 3 ? (
          <Button onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Create Project
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectWizard;
