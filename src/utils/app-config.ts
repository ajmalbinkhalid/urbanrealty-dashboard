import {
  BathIcon,
  Building2Icon,
  HomeIcon,
  MailsIcon,
  MapPinHouseIcon,
  MapPinnedIcon,
  MonitorSmartphoneIcon,
  SettingsIcon,
  ShapesIcon,
  ShoppingCartIcon,
  TicketPercentIcon,
  UniversityIcon,
  UsersRoundIcon,
} from "lucide-react";
import type { NavGroup } from "@/app/dashboard/_components/sidebar/app-sidebar";
import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Urban Realty",
  version: packageJson.version,
  copyright: `© ${currentYear}, Urban Realty.`,
  meta: {
    title: "Property Management Dashboard ",
    description:
      "Manage your properties efficiently with Urban Realty's dashboard application.",
  },
};

export const SIDEBAR_ITEMS: NavGroup[] = [
  {
    id: 1,
    label: "",
    items: [
      {
        title: "Home",
        url: "/dashboard/home",
        icon: HomeIcon,
      },
      {
        title: "Location",
        url: "/dashboard/locations",
        icon: MapPinnedIcon,
      },
      {
        title: "Agency",
        url: "/dashboard/agencies",
        icon: Building2Icon,
      },
      {
        title: "Customer",
        url: "/dashboard/customers",
        icon: UsersRoundIcon,
      },
      {
        title: "Properties",
        url: "/dashboard/properties",
        icon: UniversityIcon,
        subItems: [
          {
            title: "Category",
            url: "/dashboard/properties/categories",
            icon: ShapesIcon,
          },
          {
            title: "Amenities",
            url: "/dashboard/properties/amenities",
            icon: BathIcon,
          },
          {
            title: "Properties",
            url: "/dashboard/properties/properties",
            icon: MapPinHouseIcon,
          },
        ],
      },
      {
        title: "Packages",
        url: "/dashboard/packages",
        icon: TicketPercentIcon,
        subItems: [
          {
            title: "Packages",
            url: "/dashboard/packages/packages",
            icon: TicketPercentIcon,
          },
          {
            title: "Purchases",
            url: "/dashboard/packages/purchases",
            icon: ShoppingCartIcon,
          },
        ],
      },
      {
        title: "Enquiries",
        url: "/dashboard/enquiries",
        icon: MailsIcon,
      },
      {
        title: "CMS",
        url: "/dashboard/cms",
        icon: MonitorSmartphoneIcon,
      },
      {
        title: "General Settings",
        url: "/dashboard/general-settings",
        icon: SettingsIcon,
      },
    ],
  },
];
