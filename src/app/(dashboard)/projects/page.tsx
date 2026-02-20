import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ArrowRight, Clock, Rocket, Folder } from "lucide-react";
import { getProjects } from "@/app/actions/projects";

export const revalidate = 0;

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-white">Meus Projetos</h1>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <Folder className="h-12 w-12 text-white/20 mb-4" />
                    <h3 className="text-xl font-semibold text-white">Nenhum projeto encontrado</h3>
                    <p className="text-white/50 mt-2 max-w-sm">
                        Você ainda não possui projetos ativos.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {projects.map((project: any) => (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                            <GlassCard className="group relative overflow-hidden transition-all hover:bg-white/5 border border-white/5 hover:border-primary/30 cursor-pointer">
                                <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />

                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/20">
                                                <Rocket className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">{project.name}</h3>
                                                <p className="text-sm text-white/50">Iniciado em {new Date(project.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right hidden md:block">
                                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Status</p>
                                            <div className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 inline-block">
                                                {project.status === 'active' ? 'Em Desenvolvimento' : project.status}
                                            </div>
                                        </div>

                                        <div className="text-right hidden md:block">
                                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Prazo</p>
                                            <div className="flex items-center justify-end gap-1.5 text-white/80">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span className="text-sm font-medium">
                                                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'A definir'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
                                            <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="text-sm text-white/60">Progresso Geral</span>
                                        <span className="text-sm font-bold text-white">{project.progress || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-primary to-purple-500 rounded-full shadow-[0_0_10px_rgba(60,130,255,0.5)] transition-all duration-1000"
                                            style={{ width: `${project.progress || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
