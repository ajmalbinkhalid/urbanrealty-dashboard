"use client";

import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FormCardLayoutProps {
  form: any; // your TanStack form instance
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function FormCardLayout({
  form,
  title,
  children,
  footer,
}: FormCardLayoutProps) {
  return (
    <form.AppForm
      className="mx-auto space-y-6"
      noValidate
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Card>
        {/* HEADER */}
        <CardHeader>
          <h2 className="font-semibold text-lg">{title}</h2>
        </CardHeader>

        <Separator />

        {/* CONTENT */}
        <CardContent className="space-y-2">{children}</CardContent>

        <Separator />

        {/* FOOTER */}
        <CardFooter className="flex justify-end gap-3">{footer}</CardFooter>
      </Card>
    </form.AppForm>
  );
}
