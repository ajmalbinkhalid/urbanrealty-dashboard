"use client";

import { Bell, Briefcase, Clock, Home, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import BoltSvg from "./bolt-svg";

type NotificationType =
  | "property-request"
  | "agency-request"
  | "purchase"
  | "message";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
};

const NOTIFICATION_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  "property-request": {
    icon: <Home className="h-4 w-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  "agency-request": {
    icon: <Briefcase className="h-4 w-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  purchase: {
    icon: <ShoppingCart className="h-4 w-4" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  message: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
};

// Mock notifications - replace with actual API call
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "property-request",
    title: "New Property Request",
    description: "John Doe requested information about apartment in Downtown",
    timestamp: new Date(Date.now() - 5 * 60_000), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "agency-request",
    title: "New Agency Request",
    description: "ABC Real Estate submitted a partnership request",
    timestamp: new Date(Date.now() - 30 * 60_000), // 30 minutes ago
    read: false,
  },
  {
    id: "3",
    type: "purchase",
    title: "Purchase Completed",
    description: "Maria Garcia completed purchase for 2BR Apartment",
    timestamp: new Date(Date.now() - 2 * 60 * 60_000), // 2 hours ago
    read: true,
  },
  {
    id: "4",
    type: "message",
    title: "New Message",
    description: "You have a new message from support team",
    timestamp: new Date(Date.now() - 24 * 60 * 60_000), // 1 day ago
    read: true,
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  }
  if (diffInSeconds < 86_400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  }
  return `${Math.floor(diffInSeconds / 86_400)}d ago`;
}

function NotificationItem({ notification }: { notification: Notification }) {
  const config = NOTIFICATION_CONFIG[notification.type];

  return (
    <div
      className={cn(
        "flex gap-3 border-b p-3 transition-colors hover:bg-muted/50",
        !notification.read && "bg-blue-50/30"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          config.bgColor,
          config.color
        )}
      >
        {config.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-foreground text-sm">
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs">
          {notification.description}
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          {formatTimeAgo(notification.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Notifications"
          className="relative h-8 w-8 p-0"
          size="icon"
          variant="ghost"
        >
          <BoltSvg className="size-6 text-[#0537ae]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-1 rounded-full bg-[#fe6b35]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="font-medium text-blue-600 text-xs">
              {unreadCount} new
            </span>
          )}
        </div>

        <ScrollArea className="h-100">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-100 items-center justify-center text-center">
              <div>
                <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm">
                  No notifications yet
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-2">
          <button
            className="w-full py-2 font-medium text-blue-600 text-sm transition-colors hover:text-blue-700"
            type="button"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
