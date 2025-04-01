
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Zap } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const AI_GREETING = `Hello! I'm your AI project assistant. I can help you with:

- Project planning and task breakdown
- Resource allocation suggestions
- Timeline optimization
- Risk assessment
- Budget analysis

What can I help you with today?`;

const AI_SUGGESTIONS = [
  "Help me break down my project into tasks",
  "What's the best way to allocate resources for my team?",
  "How can I optimize my project timeline?",
  "What risks should I consider for my project?",
  "Help me estimate the budget for my project"
];

const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: AI_GREETING }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = { role: "user" as const, content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsThinking(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // For demo purposes, we'll just respond with a generic message
      const aiResponse = getAIResponse(inputMessage);
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      setIsThinking(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getAIResponse = (message: string): string => {
    // Simple response logic for demonstration purposes
    if (message.toLowerCase().includes("break down") || message.toLowerCase().includes("task")) {
      return `Here's a suggested task breakdown for your project:

1. **Planning Phase**:
   - Define project scope and objectives
   - Identify key stakeholders
   - Set up initial timeline and milestones

2. **Design Phase**:
   - Create wireframes or mockups
   - Get stakeholder feedback
   - Finalize design specifications

3. **Development Phase**: 
   - Set up development environment
   - Implement core features
   - Regular code reviews and quality checks

4. **Testing Phase**:
   - Develop test cases
   - Perform user acceptance testing
   - Bug fixes and optimizations

5. **Deployment Phase**:
   - Prepare launch strategy
   - Final checks and approvals
   - Go-live and monitoring

Would you like me to help you estimate timelines for these tasks?`;
    } else if (message.toLowerCase().includes("resource") || message.toLowerCase().includes("allocate")) {
      return `For optimal resource allocation, consider:

1. **Skills Matching**: Assign tasks based on team members' strengths
2. **Balanced Workload**: Ensure no team member is overloaded
3. **Critical Path Focus**: Allocate more resources to tasks on the critical path
4. **Buffer Time**: Include 15-20% buffer for unexpected issues
5. **Cross-training**: Have backup personnel for critical roles

Based on industry standards, a project of this size typically requires:
- 1 Project Lead (full-time)
- 2-3 Technical Specialists (full-time)
- 1 QA Specialist (part-time initially, full-time during testing)
- 1 Design/UX Resource (heavy involvement early, then as needed)

Would you like me to suggest a more detailed allocation plan?`;
    } else if (message.toLowerCase().includes("timeline") || message.toLowerCase().includes("optimize")) {
      return `To optimize your project timeline:

1. **Identify the Critical Path**: Focus on tasks that directly impact project completion
2. **Parallel Work**: Schedule non-dependent tasks to run simultaneously
3. **Time-boxing**: Set strict time limits for discussions and decision-making
4. **Regular Check-ins**: Daily 15-minute standups to catch issues early
5. **Automate Repetitive Tasks**: Use tools to handle routine work

I'd recommend using a Gantt chart to visualize dependencies and identify optimization opportunities. Would you like me to help create a timeline template for your project?`;
    } else if (message.toLowerCase().includes("risk") || message.toLowerCase().includes("consider")) {
      return `Key risks to consider for your project:

1. **Scope Creep**: Stakeholders requesting additional features mid-project
   *Mitigation*: Robust change management process with impact assessments

2. **Resource Constraints**: Team members being pulled to other projects
   *Mitigation*: Dedicated resources and backup personnel identified in advance

3. **Technical Challenges**: Unforeseen technical difficulties
   *Mitigation*: Technical spike/POC for high-risk components early

4. **Communication Gaps**: Miscommunication between team members or stakeholders
   *Mitigation*: Regular, structured communication and documentation

5. **External Dependencies**: Delays from third-party providers
   *Mitigation*: Buffer time and contractual agreements with clear timelines

Would you like me to help create a more detailed risk assessment matrix?`;
    } else if (message.toLowerCase().includes("budget") || message.toLowerCase().includes("estimate")) {
      return `For budget estimation, consider these components:

1. **Labor Costs**: 
   - Senior resources: $85-120/hour
   - Mid-level resources: $60-85/hour
   - Junior resources: $40-60/hour

2. **Tools & Software**:
   - Development tools: $100-500/month
   - Testing tools: $200-800/month
   - Hosting/infrastructure: $50-300/month

3. **Contingency Buffer**:
   - Add 15-20% for unexpected expenses

Based on similar projects, the total budget typically falls between $50,000-$80,000 depending on complexity and timeline.

Would you like me to create a more detailed budget breakdown based on your specific project parameters?`;
    } else {
      return `I understand you're interested in "${message}". This is a great topic for project management.

To help you more effectively, could you provide some specific details about your project, such as:
- The type of project you're working on
- Team size and composition
- Approximate timeline
- Any specific challenges you're facing

With these details, I can give you more tailored recommendations.`;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-pm-blue-500 to-pm-teal-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-xl">
          <Zap className="h-5 w-5 mr-2" />
          AI Project Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-15rem)] p-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`mb-4 flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div className={`flex max-w-[80%] ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
                  message.role === "assistant" ? "bg-pm-blue-100 text-pm-blue-500" : "bg-pm-teal-100 text-pm-teal-500"
                } mr-2`}>
                  {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.role === "assistant" 
                    ? "bg-muted text-foreground" 
                    : "bg-primary text-primary-foreground"
                }`}>
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="mb-4 flex justify-start">
              <div className="flex max-w-[80%]">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-pm-blue-100 text-pm-blue-500 mr-2">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex space-x-1 items-center">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-75"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        {messages.length === 1 && (
          <div className="w-full mb-4">
            <p className="text-sm text-muted-foreground mb-2">Try asking about:</p>
            <div className="flex flex-wrap gap-2">
              {AI_SUGGESTIONS.map((suggestion, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-10 resize-none"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isThinking}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
