import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoleStatus } from "@/types/index";

interface StatusBadgeProps {
  status: RoleStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Active") {
    return (
      <Badge variant="success" className="gap-1">
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
        Active
      </Badge>
    );
  }
  return <Badge variant="warning">In Active</Badge>;
}
