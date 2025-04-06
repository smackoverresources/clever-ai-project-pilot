# AI Project Pilot

An intelligent project management web application designed to help teams plan, track, and optimize their projects using modern AI-assisted tools.

## Features

- **Project Dashboard**
  - Visualize key project metrics
  - Track budget and timeline progress
  - Monitor team utilization

- **Task Management**
  - Multiple views (Kanban, List, Calendar)
  - Task prioritization and status tracking
  - Detailed task information

- **AI Project Assistant**
  - Conversational interface
  - Real-time project guidance
  - Strategic advice and insights

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Shadcn/UI components
- React Router
- Radix UI primitives

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-project-pilot.git
   cd ai-project-pilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── assistant/     # AI Assistant components
│   ├── dashboard/     # Dashboard components
│   ├── layout/        # Layout components
│   ├── tasks/         # Task management components
│   └── ui/            # Reusable UI components
├── lib/
│   ├── mockData.ts    # Mock data for development
│   ├── types.ts       # TypeScript type definitions
│   └── utils.ts       # Utility functions
└── App.tsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
