"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { homeApi } from "@/api/dashboard/homeApi";
import { SpinnerCustom } from "@/components/ui/spinner";
import type { ApiResponse } from "@/types/api-response";
import type { THomeStats } from "@/types/home";
import PropertyRequests from "../properties/properties/property-requests/page";
import { StatsCard } from "./_components/StatsCard";

type StatCardItem = {
  title: string;
  total: number;
};

const Home = () => {
  const {
    data: statsData,
    isLoading,
    isError,
  } = useQuery<ApiResponse<THomeStats>>({
    queryKey: ["homeStats"],
    queryFn: () => homeApi.homeStats(),
  });

  if (isLoading || !statsData) {
    return (
      <div className="flex items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  const statsArray: StatCardItem[] = statsData.data
    ? [
        { title: "Total Properties", total: statsData.data.properties },
        {
          title: "Properties for Sale",
          total: statsData.data.propertiesForSale,
        },
        {
          title: "Properties for Rent",
          total: statsData.data.propertiesForRent,
        },
        { title: "Total Users", total: statsData.data.users },
        { title: "Total Agencies", total: statsData.data.agencies },
      ]
    : [];

  if (isError || !statsData?.data) {
    return <div className="mb-10">Failed to load stats</div>;
  }

  return (
    <div className="mb-10">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {statsArray.map((item) => (
          <StatsCard key={item.title} title={item.title} total={item.total} />
        ))}
      </section>
      <section>
        <div className="mt-5 flex justify-between py-5">
          <h1 className="font-bold">New property requests</h1>
          <Link
            className="text-right text-accent underline"
            href={"/dashboard/properties/properties/property-requests"}
          >
            View all property requests
          </Link>
        </div>
        <div>
          <PropertyRequests showTableFooter={false} showTableToolbar={false} />
        </div>
      </section>
    </div>
  );
};

export default Home;
