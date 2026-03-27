import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/packages/purchases/pending");
  return <>Coming Soon</>;
}
