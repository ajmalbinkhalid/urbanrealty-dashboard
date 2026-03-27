"use client";

export type TeamMember = {
  teamId: string;
  name: string;
  email: string;
  mobile: string;
};

type TeamCardProps = {
  members: TeamMember[];
  isLoading?: boolean;
};

export function TeamCard({ members, isLoading = false }: TeamCardProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">
        Loading team members...
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No team members found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {members.map((member, index) => (
        <div
          className="border-b bg-slate-50 p-4 last:border-b-0"
          key={`${member.teamId}-${index}`}
        >
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="font-medium text-slate-700 text-xs">Team ID</div>
              <div className="text-slate-900 text-sm">{member.teamId}</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-700 text-xs">Name</div>
              <div className="text-slate-900 text-sm">{member.name}</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-700 text-xs">Email</div>
              <div className="text-slate-900 text-sm">{member.email}</div>
            </div>
            {/* <div className="space-y-1">
              <div className="font-medium text-slate-700 text-xs">Mobile</div>
              <div className="text-slate-900 text-sm">{member.mobile}</div>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}
