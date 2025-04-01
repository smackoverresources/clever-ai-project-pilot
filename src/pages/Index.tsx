
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProjectsSidebar from "@/components/sidebar/ProjectsSidebar";
import ProjectDashboard from "@/components/dashboard/ProjectDashboard";
import AIChat from "@/components/ai/AIChat";
import ProjectWizard from "@/components/wizard/ProjectWizard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Project, SAMPLE_PROJECTS } from "@/lib/dummy-data";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(SAMPLE_PROJECTS[0]);
  const [showWizard, setShowWizard] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleNewProject = () => {
    setShowWizard(true);
  };

  const toggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ProjectsSidebar 
          onProjectSelect={handleProjectSelect}
          onNewProject={handleNewProject}
          activeProjectId={selectedProject?.id}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6">
            <h1 className="text-xl font-bold">AI Project Pilot</h1>
            <Button 
              onClick={toggleAIChat}
              variant="outline" 
              className="flex items-center"
            >
              <Zap className="h-4 w-4 mr-2 text-pm-blue-500" />
              AI Assistant
            </Button>
          </header>
          
          <main className="flex-1 flex">
            <div className={`flex-1 ${showAIChat ? 'lg:w-2/3' : 'w-full'}`}>
              {selectedProject ? (
                <ProjectDashboard project={selectedProject} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">No Project Selected</h2>
                    <p className="text-muted-foreground mb-4">Please select a project from the sidebar or create a new one.</p>
                    <Button onClick={handleNewProject}>Create New Project</Button>
                  </div>
                </div>
              )}
            </div>
            
            {showAIChat && (
              <div className="hidden lg:block lg:w-1/3 border-l h-[calc(100vh-4rem)]">
                <AIChat />
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl p-0">
          <ProjectWizard onClose={() => setShowWizard(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Mobile AI Chat Dialog */}
      <Dialog open={showAIChat && window.innerWidth < 1024} onOpenChange={setShowAIChat}>
        <DialogContent className="max-w-lg p-0 h-[80vh]">
          <AIChat />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Index;
