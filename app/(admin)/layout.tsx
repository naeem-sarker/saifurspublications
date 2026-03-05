import { getSession } from "@/actions/authActions";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) redirect("/")

  const userRole = session.role;

  if (userRole !== "ADMIN" && userRole !== "MODERATOR") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <Link href="/" className="text-blue-500 underline">Go back to Home</Link>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 py-8 px-18">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
