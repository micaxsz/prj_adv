"use client"

import * as React from "react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BookOpenIcon, LayoutDashboardIcon } from "lucide-react"
import Link from "next/link"

// Simple navigation data for the app
const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon />
      ),
    },
    {
      title: "Tutorial",
      url: "#",
      icon: (
        <BookOpenIcon />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-400 text-zinc-950">
            <BookOpenIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">No-pedia</span>
            <span className="truncate text-xs text-muted-foreground">Tutorial App</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 py-2">
          <span className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Menu
          </span>
          <nav className="mt-2 space-y-1">
            {data.navMain.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
