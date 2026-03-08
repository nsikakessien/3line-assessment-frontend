import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/App";
import StatusBadge from "@/components/StatusBadge";
import { RoleAvatar, AvatarGroup } from "@/components/Avatar";
import ActiveRoleCard from "@/components/ActiveRoleCard";
import RolesTable from "@/components/RolesTable";
import { UserRole, ActiveRole, CheckedMap, RoleUser } from "@/types/index";

vi.mock("@/services/api", () => ({
  rolesApi: {
    getAll: vi.fn().mockResolvedValue([
      {
        id: "1",
        name: "Superadmin",
        type: "DEFAULT",
        dateCreated: "2023-01-01",
        status: "Active",
        users: [
          { id: "u1", name: "Alice", avatar: "AB" },
          { id: "u2", name: "Bob", avatar: "CD" },
        ],
      },
      {
        id: "2",
        name: "Developer-basic",
        type: "SYSTEM-CUSTOM",
        dateCreated: "2023-06-01",
        status: "InActive",
        users: [] as RoleUser[],
      },
    ] as UserRole[]),
    getActiveList: vi.fn().mockResolvedValue([
      { id: "r1", name: "Superadmin", lastActive: "06/2023", isDefault: true },
      {
        id: "r2",
        name: "Developeradmin",
        lastActive: "01/2023",
        isDefault: false,
      },
    ] as ActiveRole[]),
  },
}));

describe("StatusBadge", () => {
  it("renders Active badge", () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText("Active")).toBeDefined();
  });
  it("renders InActive badge", () => {
    render(<StatusBadge status="InActive" />);
    expect(screen.getByText("In Active")).toBeDefined();
  });
});

describe("RoleAvatar", () => {
  it("renders initials", () => {
    render(<RoleAvatar initials="AB" index={0} />);
    expect(screen.getByText("AB")).toBeDefined();
  });
});

describe("AvatarGroup", () => {
  it("shows overflow count when users exceed maxShown", () => {
    const users: RoleUser[] = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      name: `U${i}`,
      avatar: `U${i}`,
    }));
    const { container } = render(<AvatarGroup users={users} maxShown={5} />);
    expect(container).toHaveTextContent("+1");
  });
  it("no overflow when users <= maxShown", () => {
    const users: RoleUser[] = [{ id: "1", name: "Alice", avatar: "AB" }];
    const { container } = render(<AvatarGroup users={users} maxShown={5} />);
    expect(container).not.toHaveTextContent("+");
  });
});

describe("ActiveRoleCard", () => {
  const role: ActiveRole = {
    id: "r1",
    name: "Superadmin",
    lastActive: "06/2023",
    isDefault: true,
  };

  it("renders name and last active", () => {
    render(<ActiveRoleCard role={role} selected={false} onSelect={() => {}} />);
    expect(screen.getByText("Superadmin")).toBeDefined();
    expect(screen.getByText("Last active 06/2023")).toBeDefined();
  });
  it("calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(<ActiveRoleCard role={role} selected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("role-card-r1"));
    expect(onSelect).toHaveBeenCalledWith("r1");
  });
  it("aria-checked=true when selected", () => {
    render(<ActiveRoleCard role={role} selected={true} onSelect={() => {}} />);
    expect(
      screen.getByTestId("role-card-r1").getAttribute("aria-checked"),
    ).toBe("true");
  });
  it("Edit button does not propagate", () => {
    const onSelect = vi.fn();
    render(<ActiveRoleCard role={role} selected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("RolesTable", () => {
  const roles: UserRole[] = [
    {
      id: "1",
      name: "Superadmin",
      type: "DEFAULT",
      dateCreated: "2023-01-01",
      status: "Active",
      users: [{ id: "u1", name: "Alice", avatar: "AB" }],
    },
    {
      id: "2",
      name: "Developer-basic",
      type: "SYSTEM-CUSTOM",
      dateCreated: "2023-06-01",
      status: "InActive",
      users: [],
    },
  ];
  const defaultProps = {
    roles,
    loading: false,
    checkedRoles: {} as CheckedMap,
    onToggleCheck: vi.fn(),
    onToggleAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders desktop table rows", () => {
    render(<RolesTable {...defaultProps} />);
    expect(screen.getByTestId("role-row-1")).toBeDefined();
    expect(screen.getByTestId("role-row-2")).toBeDefined();
  });
  it("renders skeleton when loading", () => {
    const { container } = render(
      <RolesTable {...defaultProps} loading={true} roles={[]} />,
    );
    expect(container.querySelector(".animate-pulse")).toBeDefined();
  });
  it("calls onToggleCheck", () => {
    const onToggleCheck = vi.fn();
    render(<RolesTable {...defaultProps} onToggleCheck={onToggleCheck} />);
    fireEvent.click(screen.getByLabelText("Select Superadmin"));
    expect(onToggleCheck).toHaveBeenCalledWith("1");
  });
  it("calls onToggleAll", () => {
    const onToggleAll = vi.fn();
    render(<RolesTable {...defaultProps} onToggleAll={onToggleAll} />);
    fireEvent.click(screen.getByLabelText("Select all roles"));
    expect(onToggleAll).toHaveBeenCalled();
  });
  it("shows no roles message", () => {
    render(<RolesTable {...defaultProps} roles={[]} />);
    expect(screen.getByText("No roles found")).toBeDefined();
  });
});

describe("App", () => {
  it("renders desktop sidebar", () => {
    expect(render(<App />).getByTestId("sidebar")).toBeDefined();
  });
  it("renders mobile header", () => {
    expect(render(<App />).getByTestId("mobile-header")).toBeDefined();
  });
  it("opens mobile sidebar", () => {
    const { getByTestId, queryByTestId } = render(<App />);
    expect(queryByTestId("mobile-sidebar")).toBeNull();
    fireEvent.click(getByTestId("hamburger-btn"));
    expect(getByTestId("mobile-sidebar")).toBeDefined();
  });
  it("closes mobile sidebar on overlay click", async () => {
    const { getByTestId, queryByTestId } = render(<App />);
    fireEvent.click(getByTestId("hamburger-btn"));
    fireEvent.click(
      getByTestId("mobile-sidebar").querySelector(".absolute") as Element,
    );
    await waitFor(() => expect(queryByTestId("mobile-sidebar")).toBeNull());
  });
  it("renders roles from API", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText("Superadmin")).toBeDefined());
  });
  it("renders tab navigation", () => {
    render(<App />);
    expect(screen.getByTestId("tab-roles")).toBeDefined();
  });
  it("renders email options", () => {
    render(<App />);
    expect(screen.getByTestId("email-account-option")).toBeDefined();
    expect(screen.getByTestId("email-alternative-option")).toBeDefined();
  });
  it("hides alt email when account selected", async () => {
    render(<App />);
    const radio = screen
      .getByTestId("email-account-option")
      .querySelector("button") as Element;
    fireEvent.click(radio);
    await waitFor(() =>
      expect(screen.queryByTestId("alternative-email-input")).toBeNull(),
    );
  });
  it("renders Download all button", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByTestId("download-all-btn")).toBeDefined(),
    );
  });
});
