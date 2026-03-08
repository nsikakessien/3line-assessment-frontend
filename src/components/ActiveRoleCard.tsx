import { Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActiveRole } from "@/types/index";

interface ActiveRoleCardProps {
  role: ActiveRole;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function ActiveRoleCard({
  role,
  selected,
  onSelect,
}: ActiveRoleCardProps) {
  return (
    <div
      onClick={() => onSelect(role.id)}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(role.id)}
      data-testid={`role-card-${role.id}`}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-brand-300 bg-brand-50"
          : "border-border bg-card hover:border-brand-300",
      )}
    >
      <div
        className={cn(
          "w-[46px] h-8 rounded-[6px] border border-[#F2F4F7] flex-shrink-0 flex items-center justify-center bg-white",
        )}
      >
        <Users className="w-5 h-5 text-[#667085]" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${selected ? "text-[#53389E]" : "text-[#344054]"}`}
        >
          {role.name}
        </p>
        <p
          className={`text-sm mt-0.5 ${selected ? "text-[#7F56D9]" : "text-[#70798C]"}`}
        >
          Last active {role.lastActive}
        </p>
        <div className="flex gap-3 mt-1.5">
          <button
            className={`text-sm font-medium ${selected ? "text-[#9E77ED] hover:text-[#7F56D9]" : "text-muted-foreground hover:text-foreground"} transition-colors`}
            onClick={(e) => e.stopPropagation()}
          >
            Set as default
          </button>
          <button
            className="text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </button>
        </div>
      </div>

      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
          selected
            ? "border-brand-600 bg-brand-600"
            : "border-input bg-background",
        )}
      >
        {selected && (
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
        )}
      </div>
    </div>
  );
}
