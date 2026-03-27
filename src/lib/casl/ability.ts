import {
  AbilityBuilder,
  createMongoAbility,
  type PureAbility,
} from "@casl/ability";

// Define the actions that can be performed
export type Action = "create" | "read" | "update" | "delete" | "manage";

// Define the subjects (resources) that actions can be performed on
export type Subject = "blogs" | "categories" | "users" | "roles" | "all";

// Create the Ability type
export type AppAbility = PureAbility<[Action, Subject]>;

// Define role-based permissions
export interface Role {
  id: string | number;
  name: string;
  description?: string;
  permissions: string[];
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
}

// Create ability based on user permissions
export function createAbilityFor(user: User): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  // If user has admin role, grant all permissions
  if (
    user.role.permissions.includes("admin") ||
    user.role.name.toLowerCase() === "admin"
  ) {
    can("manage", "all");
    return build();
  }

  // Parse permissions and grant abilities
  user.role.permissions.forEach((permission) => {
    const [subject, action] = permission.split(".");

    switch (action) {
      case "manage":
        can("manage", subject as Subject);
        break;
      case "create":
        can("create", subject as Subject);
        break;
      case "read":
        can("read", subject as Subject);
        break;
      case "update":
        can("update", subject as Subject);
        break;
      case "delete":
        can("delete", subject as Subject);
        break;
      default:
        // Handle specific permissions that don't follow the pattern
        if (permission === "admin") {
          can("manage", "all");
        }
        break;
    }
  });

  return build();
}

// Create a default ability (no permissions)
export function createGuestAbility(): AppAbility {
  const { build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  return build();
}

// Helper function to check if user can perform action on subject
export function checkAbility(
  ability: AppAbility,
  action: Action,
  subject: Subject
): boolean {
  return ability.can(action, subject);
}
