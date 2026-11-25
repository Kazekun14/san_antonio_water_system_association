import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, FileText, CreditCard } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Bills',
        url: '/bills',
        icon: FileText,
    },
    {
        title: 'Payment History',
        url: '/payments',
        icon: CreditCard,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const is_admin = auth.user.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <SidebarHeader className="h-[80px] justify-center px-4 border-b border-slate-100 dark:border-neutral-900">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="h-auto w-full p-0 hover:bg-transparent data-[state=open]:bg-transparent">
                            <Link href="/dashboard" prefetch>
                                <AppLogo subtitle={is_admin ? 'Administrator' : 'Customer'} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
