import * as React from "react";
import {
  AudioWaveform,
  BadgeIndianRupee,
  Blocks,
  Command,
  File,
  Frame,
  GalleryVerticalEnd,
  Map,
  NotebookText,
  Package,
  ReceiptText,
  Settings,
  Settings2,
  ShoppingBag,
  TicketPlus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMainUser } from "./nav-main-user";
import companyname from "../json/company.json";

export function AppSidebar({ ...props }) {
  const nameL = localStorage.getItem("name");
  const emailL = localStorage.getItem("email");
  const id = localStorage.getItem("userType");
  const initialData = {
    user: {
      name: `${nameL}`,
      email: `${emailL}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: `${companyname?.CompanyName}`,
        // logo: <Logo />,
        // plan: "Startup",
      },
      // {
      //   name: "Acme Corp.",
      //   logo: `${companylogo}`,
      //   plan: "Startup",
      // },
      // {
      //   name: "Evil Corp.",
      //   logo: `${companylogo}`,
      //   plan: "Free",
      // },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/home",
        icon: Frame,
        isActive: false,
      },
      ...(id != 1
        ? [
            {
              title: "Master",
              url: "#",
              isActive: false,
              icon: Settings2,
              items: [
                {
                  title: "Category",
                  url: "/master/category",
                },
                {
                  title: "Item",
                  url: "/master/item",
                },
                {
                  title: "Buyer",
                  url: "/master/buyer",
                },
                ...(id == 3
                  ? [
                      {
                        title: "Branch",
                        url: "/master/branch",
                      },
                    ]
                  : []),
                ...(id == 3
                  ? [
                      {
                        title: "Team",
                        url: "/master/team",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      {
        title: "Purchase",
        url: "/purchase",
        icon: ShoppingBag,
        isActive: false,
      },
      {
        title: "Dispatch",
        url: "/dispatch",
        icon: ShoppingBag,
        isActive: false,
      },
      {
        title: "Stock View",
        url: "/stock-view",
        icon: Package,
        isActive: false,
      },
      {
        title: "Report",
        url: "#",
        isActive: false,
        icon: File,

        items: [
          {
            title: "Stock",
            url: "/report/stock",
          },
          ...(id != 1
            ? [
                {
                  title: "Buyer",
                  url: "/report/buyer",
                },
              ]
            : []),
          {
            title: "Single Item Stock",
            url: "/report/single-item-stock",
          },
          ...(id != 1
            ? [
                {
                  title: "Dispatch",
                  url: "/report/dispatch",
                },
              ]
            : []),
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={initialData.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        {/* <NavProjects projects={data.projects} /> */}
        <NavMain items={initialData.navMain} />
        <NavMainUser projects={initialData.userManagement} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={initialData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
