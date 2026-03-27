import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/properties/properties/property-requests");
  return <>Coming Soon</>;
}
