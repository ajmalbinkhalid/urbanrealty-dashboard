import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mt-4 font-bold text-3xl tracking-tight sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          Sorry, the page you are looking for does not exist. It may have been
          moved or deleted.
        </p>
        <div className="mt-6">
          <Link
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs transition-colors hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href="/dashboard/home"
            prefetch={false}
          >
            <span>
              <ChevronLeft className="me-1.5 size-5" />
            </span>{" "}
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
