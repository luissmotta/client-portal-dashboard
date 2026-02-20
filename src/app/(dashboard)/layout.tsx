import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050a1a] flex">
            <Sidebar />
            <div className="pl-64 w-full flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
