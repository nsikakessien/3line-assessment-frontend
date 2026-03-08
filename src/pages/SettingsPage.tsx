import { useState, useEffect, useCallback } from "react";
import { Download, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ActiveRoleCard from "@/components/ActiveRoleCard";
import RolesTable from "@/components/RolesTable";
import { rolesApi } from "@/services/api";
import { cn } from "@/lib/utils";
import { UserRole, ActiveRole, EmailOption, CheckedMap } from "@/types/index";

const TABS = [
  "My details",
  "Profile",
  "Password",
  "Team",
  "Plan",
  "Roles",
  "Notifications",
  "Integrations",
  "API",
] as const;
type Tab = (typeof TABS)[number];

const FALLBACK_ROLES: UserRole[] = [
  {
    id: "1",
    name: "Superadmin",
    type: "DEFAULT",
    dateCreated: "2023-01-01",
    status: "Active",
    users: [
      { id: "u1", name: "Alice", avatar: "AB" },
      { id: "u2", name: "Mark", avatar: "ME" },
      { id: "u3", name: "Kim", avatar: "KL" },
      { id: "u4", name: "Omar", avatar: "OP" },
      { id: "u5", name: "Quinn", avatar: "QR" },
      { id: "u6", name: "Sara", avatar: "ST" },
      { id: "u7", name: "Tom", avatar: "TU" },
    ],
  },
  {
    id: "2",
    name: "Merchantadmin",
    type: "DEFAULT",
    dateCreated: "2023-02-01",
    status: "Active",
    users: [
      { id: "u8", name: "Nora", avatar: "NB" },
      { id: "u9", name: "Owen", avatar: "OC" },
      { id: "u10", name: "Paula", avatar: "PD" },
      { id: "u11", name: "Quinn", avatar: "QE" },
      { id: "u12", name: "Ryan", avatar: "RF" },
      { id: "u13", name: "Sara", avatar: "SG" },
    ],
  },
  {
    id: "3",
    name: "supportadmin",
    type: "DEFAULT",
    dateCreated: "2023-02-01",
    status: "Active",
    users: [
      { id: "u14", name: "Sam", avatar: "SA" },
      { id: "u15", name: "Tara", avatar: "TB" },
      { id: "u16", name: "Uma", avatar: "UC" },
      { id: "u17", name: "Vera", avatar: "VD" },
    ],
  },
  {
    id: "4",
    name: "sales personnel",
    type: "CUSTOM",
    dateCreated: "2023-03-01",
    status: "Active",
    users: [
      { id: "u18", name: "Sam", avatar: "SP" },
      { id: "u19", name: "Wendy", avatar: "WB" },
      { id: "u20", name: "Xavier", avatar: "XC" },
    ],
  },
  {
    id: "5",
    name: "Deputy sales personnel",
    type: "CUSTOM",
    dateCreated: "2023-04-01",
    status: "InActive",
    users: [
      { id: "u21", name: "Dana", avatar: "DP" },
      { id: "u22", name: "Yara", avatar: "YB" },
      { id: "u23", name: "Zoe", avatar: "ZC" },
      { id: "u24", name: "Adam", avatar: "AD" },
    ],
  },
  {
    id: "6",
    name: "Developeradmin",
    type: "SYSTEM-CUSTOM",
    dateCreated: "2023-05-01",
    status: "Active",
    users: [
      { id: "u25", name: "Dev", avatar: "DA" },
      { id: "u26", name: "Beth", avatar: "BB" },
      { id: "u27", name: "Carl", avatar: "CC" },
      { id: "u28", name: "Diana", avatar: "DC" },
    ],
  },
  {
    id: "7",
    name: "Developer-basic",
    type: "SYSTEM-CUSTOM",
    dateCreated: "2023-06-01",
    status: "Active",
    users: [
      { id: "u29", name: "Dev", avatar: "DB" },
      { id: "u30", name: "Eva", avatar: "EB" },
      { id: "u31", name: "Frank", avatar: "FC" },
    ],
  },
];

const FALLBACK_ACTIVE_ROLES: ActiveRole[] = [
  { id: "r1", name: "Superadmin", lastActive: "06/2023", isDefault: true },
  { id: "r2", name: "Developeradmin", lastActive: "01/2023", isDefault: false },
  { id: "r3", name: "Supportadmin", lastActive: "10/2022", isDefault: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Roles");
  const [emailOption, setEmailOption] = useState<EmailOption>("alternative");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("r1");
  const [checkedRoles, setCheckedRoles] = useState<CheckedMap>({});
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activeRoles, setActiveRoles] = useState<ActiveRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [rolesData, activeData] = await Promise.all([
        rolesApi.getAll(),
        rolesApi.getActiveList(),
      ]);
      setRoles(rolesData);
      setActiveRoles(activeData);
    } catch {
      setRoles(FALLBACK_ROLES);
      setActiveRoles(FALLBACK_ACTIVE_ROLES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleToggleCheck = (id: string) =>
    setCheckedRoles((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleToggleAll = () => {
    const allChecked = roles.every((r) => checkedRoles[r.id]);
    const next: CheckedMap = {};
    roles.forEach((r) => {
      next[r.id] = !allChecked;
    });
    setCheckedRoles(next);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-foreground">Settings</h1>
          <p className=" text-muted-foreground mt-1">
            Manage your team and preferences here.
          </p>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 mb-8">
          <div
            className="inline-flex min-w-max rounded-lg border border-input"
            role="tablist"
          >
            {TABS.map((tab, index) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-${tab.toLowerCase().replace(/\s/g, "-")}`}
                className={cn(
                  "px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                  index < TABS.length - 1 && "border-r border-input",
                  activeTab === tab
                    ? "bg-muted font-medium text-[#1D2939]"
                    : "bg-background text-[#344054] hover:text-foreground hover:bg-muted/50",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 pb-5">
          <h2 className="text-lg font-medium text-foreground">User Roles</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update your roles details and information.
          </p>
        </div>
        <Separator className="mb-6 md:mb-8" />

        <div className="flex flex-col md:flex-row gap-5 md:gap-16 mb-6 md:mb-8">
          <div className="md:w-56 shrink-0">
            <Label className="text-sm font-medium text-foreground">
              Connected email
            </Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              Select role account
            </p>
          </div>

          <div className="flex-1" data-testid="email-options">
            <RadioGroup
              value={emailOption}
              onValueChange={(v) => setEmailOption(v as EmailOption)}
              className="space-y-4"
            >
              <div
                className="flex items-start gap-3"
                data-testid="email-account-option"
              >
                <RadioGroupItem
                  value="account"
                  id="email-account"
                  className="mt-0.5"
                />
                <Label
                  htmlFor="email-account"
                  className="cursor-pointer font-normal"
                >
                  <p className="text-sm font-medium text-foreground">
                    My account email
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia@untitledui.com
                  </p>
                </Label>
              </div>

              <div
                className="flex items-start gap-3"
                data-testid="email-alternative-option"
              >
                <RadioGroupItem
                  value="alternative"
                  id="email-alternative"
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="email-alternative"
                    className="cursor-pointer font-normal"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">
                      An alternative email
                    </p>
                  </Label>
                  {emailOption === "alternative" && (
                    <div
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm max-w-sm"
                      data-testid="alternative-email-input"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-foreground">
                        billing@untitledui.com
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator className="mb-6 md:mb-8" />

        <div className="flex flex-col md:flex-row gap-5 md:gap-16 mb-6 md:mb-8">
          <div className="md:w-56 shrink-0">
            <Label className="text-sm font-medium text-foreground">
              Active Role
            </Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              Select active role available to the user.
            </p>
          </div>

          <div className="flex-1 space-y-3" data-testid="active-roles">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-muted animate-pulse"
                  />
                ))
              : activeRoles.map((role) => (
                  <ActiveRoleCard
                    key={role.id}
                    role={role}
                    selected={selectedRoleId === role.id}
                    onSelect={setSelectedRoleId}
                  />
                ))}

            <Button
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground pl-1"
              data-testid="add-role-btn"
            >
              <Plus className="h-4 w-4" />
              Add role to user
            </Button>
          </div>
        </div>

        <Separator className="mb-6 md:mb-8" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              User Roles
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              data-testid="download-all-btn"
            >
              <Download className="h-4 w-4" />
              Download all
            </Button>
          </div>

          <RolesTable
            roles={roles}
            loading={loading}
            checkedRoles={checkedRoles}
            onToggleCheck={handleToggleCheck}
            onToggleAll={handleToggleAll}
          />
        </div>
      </div>
    </div>
  );
}
