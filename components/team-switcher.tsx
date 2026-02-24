"use client"

import * as React from "react"

import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string
    logo: string
    plan: string
  }
}) {
  // const [activeTeam, setActiveTeam] = React.useState(teams[0])



  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>

          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Image src={team.logo} alt={team.name} width={32} height={32} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{team.name}</span>
              <span className="truncate text-xs">{team.plan}</span>
            </div>
          </SidebarMenuButton>

        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
