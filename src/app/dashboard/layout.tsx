import { AppSidebar } from "@/components/containers/sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col gap-2 min-h-screen w-full p-2">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
