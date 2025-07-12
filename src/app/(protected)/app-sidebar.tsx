"use client"

import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Link from "next/link"


import { usePathname  } from "next/navigation"
import { clsx } from "clsx"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import Image from "next/image"
import useProject from "~/hooks/use-project"

const items =[
 {  
    title:"Dashboard",
    url : "/dashboard",
    icon : LayoutDashboard

},
 {  
    title:"Q&A",
    url : "/qa",
    icon : Bot

},
 {  
    title:"Meetings",
    url : "/meetings",
    icon : Presentation

},
 {  
    title:"Billing",
    url : "/billing",
    icon : CreditCard

}
]

export  function AppSidebar(){
const pathname =  usePathname();
const {open}  = useSidebar();

const {projects ,selectedProjectId , setProjectId} = useProject();
 return(<Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
              <div className="flex items-center gap-20   ">
                <Image src="/logo.png" className="rounded-4xl" alt="logo" width={40} height={40} />
   {
    open &&
    <h1 className="text-xl font-bold text-primary/80">
    Gitsync
     </h1>
   }
              </div>
            </SidebarHeader>

    <SidebarContent>
        <SidebarGroup>
       <SidebarGroupLabel>
        Application
        </SidebarGroupLabel> 
        <SidebarGroupContent>
            <SidebarMenu>
        {
  items.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <Link
          href={item.url}
          className={clsx(
            {
              '!bg-primary !text-white': pathname === item.url,
            },
            'list-none'
          )}
        >
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))
}

            </SidebarMenu>
            </SidebarGroupContent>    
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel>
              Your Projects  
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
    {
        projects?.map((item)=>(
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton asChild>
<div
  onClick={() => setProjectId(item.id)}
  className={clsx(
    'flex items-center gap-2 p-4 rounded-md cursor-pointer w-full transition-colors',
    {
      'bg-white text-pretty': item.id === selectedProjectId,
      'hover:bg-muted': item.id !== selectedProjectId,
    }
  )}
>
  <div
    className={clsx(
      'w-7 h-7 rounded-sm border flex items-center justify-center text-sm',
      {
        'bg-white text-primary ': item.id !== selectedProjectId,
        'bg-primary text-black font-semibold': item.id === selectedProjectId,
      }
    )}
  >
    {item.name.charAt(0).toUpperCase()}
  </div>
  <span className="truncate">{item.name}</span>
</div>

</SidebarMenuButton>

        </SidebarMenuItem>    
        ))
    }
    <div className="h-2"></div>
    {
        open &&(
            <SidebarMenuItem>
        <Link href='/create'>
            <Button variant={'outline'} className="w-fit">
  <Plus/>   Create Project
    </Button>
    </Link>
    </SidebarMenuItem>
        )
    }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    </SidebarContent>

    </Sidebar>
 )   
}