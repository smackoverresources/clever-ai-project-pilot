import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandMenu } from '../shared/CommandMenu';
import { useHotkeys } from 'react-hotkeys-hook';

export function Layout() {
  const [showCommandMenu, setShowCommandMenu] = React.useState(false);
  const location = useLocation();

  // Toggle command menu with Cmd+K or Ctrl+K
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setShowCommandMenu((prev) => !prev);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="container mx-auto py-6 px-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command Menu */}
      <CommandMenu open={showCommandMenu} onOpenChange={setShowCommandMenu} />
    </div>
  );
} 