"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import UserSvg from "./user-svg";

export function UserMenu() {
  const { logout, user } = useAuth();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="User menu"
          className="flex size-8 items-center justify-center rounded-full bg-[#d9d9d9] transition hover:bg-gray-300/80"
          type="button"
        >
          <UserSvg className="size-5 text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <button
            aria-label="User menu"
            className="flex size-8 items-center justify-center rounded-full bg-[#d9d9d9] transition hover:bg-gray-300/80"
            type="button"
          >
            <UserSvg className="size-5 text-white" />
          </button>
          <div className="flex flex-1 flex-col">
            <span className="text-foreground">{user?.name}</span>
            <span className="text-muted-foreground text-xs">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-foreground"
          onClick={() => router.push("/dashboard/profile")}
        >
          <UserRound />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={logout}
          variant="destructive"
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
