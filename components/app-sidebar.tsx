"use client"

import * as React from "react"
import {
  ImagePlus,
  Layers,
  LayoutDashboard,
  Package,
  PenTool,
  ShoppingBag,
  Users2,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Md Naeem Sarker",
    email: "naeemsarker@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  team:
  {
    name: "Saifurs Publications",
    logo: "/saifurs.svg",
    plan: "Admin Panel",
  },
  projects: [
    {
      name: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: Users2,
    },
    {
      name: "Authors",
      url: "/admin/authors",
      icon: PenTool,
    },
    {
      name: "Categories",
      url: "/admin/categories",
      icon: Layers,
    },
    {
      name: "Products",
      url: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      url: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Heroes",
      url: "/admin/heros",
      icon: ImagePlus,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
