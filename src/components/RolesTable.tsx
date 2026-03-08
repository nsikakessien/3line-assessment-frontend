import * as React from "react";
import { useRef, useEffect } from "react";
import { Download, ArrowUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AvatarGroup } from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import { UserRole, CheckedMap } from "@/types/index";

function SkeletonRow() {
  return (
    <tr className="border-t border-border animate-pulse">
      {[3, 4, 5, 4, 6, 2].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className={`h-4 bg-muted rounded w-${w}/6`} />
        </td>
      ))}
    </tr>
  );
}

interface IndeterminateCheckboxProps extends React.ComponentPropsWithoutRef<
  typeof Checkbox
> {
  indeterminate?: boolean;
}

function IndeterminateCheckbox({
  indeterminate,
  checked,
  onCheckedChange,
  ...props
}: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (ref.current) {
      const input = ref.current.querySelector("input");
      if (input) input.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return (
    <Checkbox
      ref={ref}
      checked={indeterminate ? "indeterminate" : checked}
      onCheckedChange={onCheckedChange}
      {...props}
    />
  );
}

interface RolesTableProps {
  roles: UserRole[];
  loading: boolean;
  checkedRoles: CheckedMap;
  onToggleCheck: (id: string) => void;
  onToggleAll: () => void;
}

export default function RolesTable({
  roles,
  loading,
  checkedRoles,
  onToggleCheck,
  onToggleAll,
}: RolesTableProps) {
  const allChecked = roles.length > 0 && roles.every((r) => checkedRoles[r.id]);
  const someChecked = roles.some((r) => checkedRoles[r.id]);

  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" data-testid="roles-table">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-3">
                  <IndeterminateCheckbox
                    checked={allChecked}
                    indeterminate={someChecked && !allChecked}
                    onCheckedChange={onToggleAll}
                    aria-label="Select all roles"
                  />
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    Name <ArrowUp className="w-3 h-3" />
                  </span>
                </div>
              </th>
              {["Type", "Date created", "Status", "Role users"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                >
                  {h}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : roles.map((role) => (
                  <tr
                    key={role.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                    data-testid={`role-row-${role.id}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={!!checkedRoles[role.id]}
                          onCheckedChange={() => onToggleCheck(role.id)}
                          aria-label={`Select ${role.name}`}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {role.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {role.type}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(role.dateCreated)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={role.status} />
                    </td>
                    <td className="px-4 py-4">
                      <AvatarGroup users={role.users} maxShown={5} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label={`Download ${role.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-border">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))
          : roles.map((role) => (
              <div
                key={role.id}
                className="p-4 flex items-start gap-3"
                data-testid={`role-mobile-${role.id}`}
              >
                <Checkbox
                  className="mt-1 shrink-0"
                  checked={!!checkedRoles[role.id]}
                  onCheckedChange={() => onToggleCheck(role.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {role.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {role.type} · {formatDate(role.dateCreated)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <StatusBadge status={role.status} />
                    <AvatarGroup users={role.users.slice(0, 3)} />
                    {role.users.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{role.users.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground shrink-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
      </div>

      {!loading && roles.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No roles found
        </div>
      )}
    </div>
  );
}
