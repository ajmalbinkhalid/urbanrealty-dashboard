// StatsCard.tsx
import { Box } from "lucide-react";

type StatsCardProps = {
  title: string;
  total: number;
};

export function StatsCard({ title, total }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
        <Box className="h-7 w-7 text-orange-500" />
      </div>

      <div>
        <p className="font-medium text-primary text-sm">{title}</p>
        <p className="font-medium text-3xl text-primary">{total}</p>
      </div>
    </div>
  );
}
