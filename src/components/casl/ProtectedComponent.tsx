import type React from "react";
import { useAbility } from "@/contexts/ability-context";
import type { Action, Subject } from "@/lib/casl/ability";

type ProtectedComponentProps = {
  action: Action;
  subject: Subject;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function ProtectedComponent({
  action,
  subject,
  children,
  fallback = null,
}: ProtectedComponentProps) {
  const { ability } = useAbility();

  if (ability.can(action, subject)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  action: Action,
  subject: Subject,
  fallback?: React.ReactNode
) {
  return function ProtectedComponentHOC(props: P) {
    return (
      <ProtectedComponent action={action} fallback={fallback} subject={subject}>
        <Component {...props} />
      </ProtectedComponent>
    );
  };
}

export function usePermissions() {
  const { ability } = useAbility();

  const can = (action: Action, subject: Subject) =>
    ability.can(action, subject);
  const cannot = (action: Action, subject: Subject) =>
    ability.cannot(action, subject);

  return { can, cannot, ability };
}
