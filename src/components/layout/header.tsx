import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Default values if no user (should be handled by layout/middleware, but safe check)
    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Visitante";
    const email = user?.email || "";

    // Determine Role
    const isAdmin = email === 'luissmotta@outlook.com';
    const role = isAdmin ? "Administrador" : "Cliente";

    // Custom name override for Admin (optional, since user requested "Luis Motta" for admin)
    const displayName = isAdmin ? "Luis Motta" : name;

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#050a1a]/80 px-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Dashboard</h2>
            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 box-content border-2 border-[#050a1a]" />
                </button>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-3 pl-2">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-purple-500 ring-2 ring-white/10" />
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-white leading-none">{displayName}</p>
                        <p className="text-xs text-white/50 mt-1 leading-none">{role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
