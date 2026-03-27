"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { FormGrid } from "@/components/form/FormGrid";
import type { ViewSheetFormProps } from "@/components/ui/data-table/actions/types/sheet-form-props";
import { ViewTabs } from "@/components/ui/tabs/tabs-layout";
import type { TAgencyLogsResponse } from "@/types/agency";
import { StorageUrl } from "@/utils/url-helper";
import { AgencyApprovalActions } from "./AgencyApprovalActions";
import { TeamCard } from "./team-card";

export function AgencyViewComponent({
  data,
  onTriggerConfirm,
  page,
}: ViewSheetFormProps<TAgencyLogsResponse> & {
  onTriggerConfirm?: (mode: "accept" | "reject", agencyId: string) => void;
}) {
  const agency = data?.agency ?? null;

  const isPendingPage = page === "pending";
  const isActivePage = page === "active";

  if (!agency) {
    return (
      <div className="px-6 py-4 text-base text-muted-foreground">
        Loading agency details…
      </div>
    );
  }

  const team = [
    {
      teamId: "TM-1001",
      name: agency.firstName,
      email: agency.email,
      mobile: `${agency.companyPhone?.phoneCode} ${agency.companyPhone?.phoneNumber}`,
    },
  ];

  // function getAgencyMobile(agency: typeof data.agency) {
  //   if (agency?.phone) {
  //     return `${agency.phone?.phoneCode} ${agency.phone?.phoneNumber}`;
  //   }
  //   if (agency?.companyPhone) {
  //     return `${agency.companyPhone?.phoneCode} ${agency.companyPhone?.phoneNumber}`;
  //   }
  //   return "—";
  // }

  const basicInfoTab = (
    <FormGrid
      className="rounded-lg bg-muted/40 py-6"
      cols={`grid-cols-1 ${isPendingPage ? "md:grid-cols-4" : "md:grid-cols-3"}`}
      gapX="gap-x-12"
      gapY="gap-y-6"
    >
      <FormGrid.Item>
        <span className="text-base">Agency ID</span>
        <p className="text-muted-foreground text-sm">
          {agency.agencyId || "—"}
        </p>
      </FormGrid.Item>
      <FormGrid.Item>
        <span className="text-base">Company Name</span>
        <p className="text-muted-foreground text-sm">
          {agency.companyName || "—"}
        </p>
      </FormGrid.Item>
      {isPendingPage && <FormGrid.Item />}
      {isPendingPage && (
        <FormGrid.Item className="flex items-start justify-end">
          <AgencyApprovalActions
            agencyId={data.agency._id}
            onTriggerConfirm={onTriggerConfirm}
          />
        </FormGrid.Item>
      )}
      {isActivePage && (
        <FormGrid.Item>
          <span className="text-base">CR Number</span>
          <p className="text-muted-foreground text-sm">
            {agency.cRNumber || "—"}
          </p>
        </FormGrid.Item>
      )}
      <FormGrid.Item>
        <span className="text-base">Contact Person</span>
        <p className="text-muted-foreground text-sm">
          {agency.firstName || "—"} {agency.lastName || "—"}
        </p>
      </FormGrid.Item>
      <FormGrid.Item>
        <span className="text-base">Email</span>
        <p className="wrap-break-word max-w-full text-muted-foreground text-sm leading-relaxed">
          {agency.email ?? agency.companyEmail ?? "-"}
        </p>
      </FormGrid.Item>
      {/* <FormGrid.Item>
        <span className="text-base">Mobile</span>
        <p className="text-muted-foreground text-sm">
          {getAgencyMobile(agency)}
        </p>
      </FormGrid.Item> */}
      <FormGrid.Item className="col-span-full">
        <span className="text-base">About (EN)</span>
        <p className="text-muted-foreground text-sm">
          {agency.about?.en || "—"}
        </p>
      </FormGrid.Item>
      <FormGrid.Item className="col-span-full">
        <span className="text-base">About (AR)</span>
        <p className="text-muted-foreground text-sm">
          {agency.about?.ar || "—"}
        </p>
      </FormGrid.Item>
      <FormGrid.Item>
        <span className="text-base">Created At</span>
        <p className="text-muted-foreground text-sm">
          {agency.createdAt
            ? dayjs(agency.createdAt).format("DD-MM-YYYY")
            : "—"}
        </p>
      </FormGrid.Item>
      <FormGrid.Item>
        <span className="text-base">Updated At</span>
        <p className="text-muted-foreground text-sm">
          {agency.createdAt
            ? dayjs(agency.updatedAt).format("DD-MM-YYYY")
            : "—"}
        </p>{" "}
      </FormGrid.Item>
      {agency.companyLogo && (
        <FormGrid.Item className="col-span-full">
          <span className="text-base">Company Logo</span>
          <Image
            alt="company logo"
            className="object-cover pt-2"
            height={150}
            src={StorageUrl + agency.companyLogo}
            width={150}
          />
        </FormGrid.Item>
      )}
    </FormGrid>
  );

  const logsTab = (
    <div className="space-y-6">
      {data.isApproved && data.approval && (
        <>
          <h3 className="font-semibold text-base">Approved</h3>

          <div className="rounded-md border bg-white p-4 shadow-base">
            <div className="mb-3 font-medium text-muted-foreground text-sm">
              Approved •{" "}
              {data.approval.verifiedAt
                ? new Date(data.approval.verifiedAt).toLocaleString()
                : "—"}
            </div>

            <FormGrid className="grid grid-cols-2 gap-4">
              <FormGrid.Item>
                <span className="font-medium text-base">Agency ID</span>
                <p className="text-base text-muted-foreground">
                  {agency.agencyId}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">Company Name</span>
                <p className="text-base text-muted-foreground">
                  {agency.companyName}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">CR Number</span>
                <p className="text-base text-muted-foreground">
                  {agency.cRNumber}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">Company Email</span>
                <p className="text-base text-muted-foreground">
                  {agency.companyEmail}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">Company Phone</span>
                <p className="text-base text-muted-foreground">
                  {agency.companyPhone?.phoneCode}{" "}
                  {agency.companyPhone?.phoneNumber}
                </p>
              </FormGrid.Item>
            </FormGrid>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">
          Rejection History ({data.rejectionCount})
        </h3>
        <span className="text-muted-foreground text-sm">
          Total: {data.rejectionCount}
        </span>
      </div>

      {data.rejectionHistory?.length ? (
        data.rejectionHistory.map((log, index) => (
          <div
            className="rounded-md border bg-white p-4 shadow-base"
            key={log._id}
          >
            <div className="mb-3 font-medium text-muted-foreground text-sm">
              Rejection #{index + 1} •{" "}
              {new Date(log.createdAt).toLocaleString()}
            </div>

            <FormGrid className="grid grid-cols-2 gap-4">
              <FormGrid.Item>
                <span className="font-medium text-base">Agency ID</span>
                <p className="text-base text-muted-foreground">
                  {agency.agencyId}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">Contact Person</span>
                <p className="text-base text-muted-foreground">
                  {log.firstName} {log.lastName}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">Company Name</span>
                <p className="text-base text-muted-foreground">
                  {log.companyName}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">CR Number</span>
                <p className="text-base text-muted-foreground">
                  {log.cRNumber}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">Company Email</span>
                <p className="text-base text-muted-foreground">
                  {log.companyEmail}
                </p>
              </FormGrid.Item>

              <FormGrid.Item>
                <span className="font-medium text-base">Company Phone</span>
                <p className="text-base text-muted-foreground">
                  {log.companyPhone?.phoneCode} {log.companyPhone?.phoneNumber}
                </p>
              </FormGrid.Item>

              <FormGrid.Item className="col-span-2">
                <span className="font-medium text-base text-red-600">
                  Rejection Reason
                </span>
                <p className="text-base text-muted-foreground">
                  {log.verificationRejectMessage}
                </p>
              </FormGrid.Item>
            </FormGrid>
          </div>
        ))
      ) : (
        <p className="text-base text-muted-foreground">
          No rejection logs available.
        </p>
      )}
    </div>
  );

  const tabs = [
    {
      value: "basic",
      label: "Basic Info",
      content: basicInfoTab,
    },
    ...(data.isApproved
      ? [
          {
            value: "packages",
            label: "Package purchase history",
            content: (
              <div className="text-base text-muted-foreground">
                Package purchase history will appear here.
              </div>
            ),
          },
          {
            value: "team",
            label: "My team",
            content: <TeamCard members={team || []} />,
          },
        ]
      : []),

    {
      value: "logs",
      label: "Activity Logs",
      content: logsTab,
    },
  ];

  return <ViewTabs tabs={tabs} />;
}
