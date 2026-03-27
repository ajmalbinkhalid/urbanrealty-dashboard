import type { ReactNode } from "react";

import HeaderAuth from "./_components/header-auth";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="">
      <HeaderAuth />
      <div className="">{children}</div>
    </main>
  );
}
