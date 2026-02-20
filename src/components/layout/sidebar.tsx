import Link from "next/link";
import { LayoutDashboard, FolderOpen, CheckSquare, Calendar, Settings, LogOut } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Projetos", href: "/projects", icon: FolderOpen },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Calendário", href: "/calendar", icon: Calendar },
];

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#050a1a] transition-transform">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-10 flex items-center gap-3 px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/20">
                        <div className="h-3 w-3 rounded-sm bg-primary" />
                    </div>
                    <span className="text-lg font-semibold text-white tracking-tight">Motta's</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <item.icon className="mr-3 h-5 w-5 shrink-0 text-white/50 group-hover:text-white transition-colors" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto border-t border-white/10 pt-4 space-y-1">
                    <form action={async () => {
                        "use server";
                        const { logout } = await import("@/app/actions/auth");
                        await logout();
                    }}>
                        <button
                            type="submit"
                            className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                        >
                            <LogOut className="mr-3 h-5 w-5 shrink-0" />
                            Sair
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
