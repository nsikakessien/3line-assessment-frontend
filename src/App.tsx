import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SettingsPage from "@/pages/SettingsPage";
import { Button } from "@/components/ui/button";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <aside
        className="hidden md:flex flex-col w-64 shrink-0"
        data-testid="sidebar"
      >
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          data-testid="mobile-sidebar"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-72 shadow-xl flex flex-col">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0"
          data-testid="mobile-header"
        >
          <div className="flex items-center gap-2.5">
            <img src="/icons/logo.svg" alt="logo" />

            <span className="font-semibold text-sm text-foreground">
              Untitled UI
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            data-testid="hamburger-btn"
            className="h-8 w-8"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-hidden flex">
          <SettingsPage />
        </main>
      </div>
    </div>
  );
}
