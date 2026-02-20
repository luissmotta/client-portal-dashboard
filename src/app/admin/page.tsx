import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { Plus, Folder, Users, Layout } from "lucide-react";
import { getProjects } from "@/app/actions/projects";

export const revalidate = 0;

export default async function AdminDashboard() {
    const projects = await getProjects();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
                    <p className="text-white/60 mt-1">Gerencie projetos, clientes e validações.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                >
                    <Plus className="h-4 w-4" />
                    Novo Projeto
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Folder className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/40 font-bold uppercase">Projetos Ativos</p>
                        <p className="text-3xl font-bold text-white">{projects.length}</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/40 font-bold uppercase">Clientes</p>
                        <p className="text-3xl font-bold text-white">-</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Layout className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/40 font-bold uppercase">Páginas em Validação</p>
                        <p className="text-3xl font-bold text-white">-</p>
                    </div>
                </GlassCard>
            </div>

            {/* Project List for Management */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Gerenciar Projetos</h2>
                <div className="grid gap-4">
                    {projects.map((project: any) => (
                        <GlassCard key={project.id} className="flex items-center justify-between p-4 group hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                    <Folder className="h-5 w-5 text-white/50" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors">{project.name}</h3>
                                    <p className="text-sm text-white/40">{project.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right mr-4">
                                    <p className="text-xs text-white/40 uppercase font-bold">Status</p>
                                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        {project.status}
                                    </span>
                                </div>
                                <Link
                                    href={`/admin/projects/${project.id}`}
                                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Gerenciar &rarr;
                                </Link>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
