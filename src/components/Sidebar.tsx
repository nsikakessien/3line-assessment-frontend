import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  FileText,
  Users,
  Mic2,
  HelpCircle,
  Settings,
  Search,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar as ShadAvatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/index";

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home },
  { label: "Dashboard", icon: LayoutDashboard, badge: 10 },
  { label: "Projects", icon: FolderOpen },
  { label: "Tasks", icon: CheckSquare },
  { label: "Reporting", icon: FileText },
  { label: "Users", icon: Users },
  { label: "Support", icon: HelpCircle },
  { label: "Settings", icon: Settings, active: true },
];

const SEARCH_SUGGESTIONS: string[] = ["Olivia Rhye"];

function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase()),
      )
    : SEARCH_SUGGESTIONS;

  const isOpen = focused && filtered.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      setQuery(filtered[activeIndex]);
      setFocused(false);
      setActiveIndex(-1);
    } else if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  }

  function highlight(text: string) {
    if (!query.trim()) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <span className="font-semibold text-brand-700">
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative px-4 mb-4">
      <div
        className={cn(
          "flex items-center gap-2 px-3 rounded-lg border bg-background transition-all duration-150",
          focused
            ? "border-brand-300 ring-[3px] ring-brand-100"
            : "border-input shadow-sm",
        )}
      >
        <Search
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            focused ? "text-brand-600" : "text-muted-foreground",
          )}
        />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="border-0 shadow-none focus-visible:ring-0 h-9 px-0 text-sm bg-transparent"
          aria-label="Search"
          aria-expanded={isOpen}
          role="combobox"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
            onMouseDown={(e) => {
              e.preventDefault();
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-1.5 rounded-lg border border-border bg-popover shadow-lg z-50 overflow-hidden">
          <ul className="py-1 max-h-52 overflow-y-auto" role="listbox">
            {filtered.map((item, i) => (
              <li
                key={item}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery(item);
                  setFocused(false);
                  setActiveIndex(-1);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors",
                  i === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted",
                )}
                role="option"
                aria-selected={i === activeIndex}
              >
                <Search
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    i === activeIndex
                      ? "text-brand-600"
                      : "text-muted-foreground",
                  )}
                />
                {highlight(item)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="flex items-center justify-between px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <img src="/icons/logo.svg" alt="logo" />
          <span className="font-semibold text-gray-900 text-sm">
            Untitled UI
          </span>
        </div>
        {mobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <SearchDropdown />

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-0.5 pb-4">
          {NAV_ITEMS.map(({ label, icon: Icon, badge, active }) => (
            <button
              key={label}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg  transition-colors group text-left",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="flex-1">{label}</span>
              {badge !== undefined && (
                <Badge
                  variant="secondary"
                  className="text-[#344054] bg-[#F2F4F7] text-sm px-2 py-0"
                >
                  {badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className=" mb-3 p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm font-medium text-foreground mb-0.5">
            New features available!
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Check out the new dashboard view. Pages now load faster.
          </p>
          <img
            src="/images/feature.svg"
            alt="Feature Promo"
            className="w-full rounded-lg mb-3"
          />
          <div className="flex gap-3 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              Dismiss
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-sm font-medium text-brand-700 hover:text-brand-800 hover:bg-transparent"
            >
              What's new?
            </Button>
          </div>
        </div>
      </ScrollArea>

      <Separator />

      <div className="px-4 py-4 flex items-center gap-3">
        <ShadAvatar className="h-9 w-9 shrink-0">
          <img src="/images/olivia-avatar.svg" alt="olivia" />
        </ShadAvatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            Olivia Rhye
          </p>
          <p className="text-xs text-muted-foreground truncate">
            olivia@untitledui.com
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
