import { Avatar as ShadAvatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { RoleUser } from "@/types/index";

const AVATAR_COLORS: { bg: string; text: string }[] = [
  { bg: "#E9D7FE", text: "#6941C6" },
  { bg: "#FEE4E2", text: "#B42318" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#F0FDF4", text: "#166534" },
];

interface RoleAvatarProps {
  initials: string;
  index?: number;
  size?: number;
  className?: string;
}

export function RoleAvatar({
  initials,
  index = 0,
  size = 28,
  className,
}: RoleAvatarProps) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <ShadAvatar
      className={cn(
        "border-2 border-white -ml-1.5 first:ml-0 shrink-0",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <AvatarFallback
        className="text-xs font-semibold"
        style={{
          backgroundColor: color.bg,
          color: color.text,
          fontSize: size * 0.36,
        }}
      >
        {initials}
      </AvatarFallback>
    </ShadAvatar>
  );
}

interface AvatarGroupProps {
  users: RoleUser[];
  maxShown?: number;
}

export function AvatarGroup({ users, maxShown = 5 }: AvatarGroupProps) {
  const shown = users.slice(0, maxShown);
  const extra = users.length - shown.length;

  return (
    <div className="flex items-center pl-1.5">
      {shown.map((user, i) => (
        <RoleAvatar key={user.id} initials={user.avatar} index={i} />
      ))}
      {extra > 0 && (
        <ShadAvatar
          className="border-2 border-white -ml-1.5 shrink-0"
          style={{ width: 28, height: 28 }}
        >
          <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
            +{extra}
          </AvatarFallback>
        </ShadAvatar>
      )}
    </div>
  );
}
