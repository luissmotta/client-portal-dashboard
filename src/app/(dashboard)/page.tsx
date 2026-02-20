import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUpRight, Clock, AlertCircle, Folder } from "lucide-react";
import { getProjects } from "@/app/actions/projects";
import { getTasks } from "@/app/actions/tasks";
import Link from "next/link";

export const revalidate = 0;

export default async function DashboardPage() {
    const projects = await getProjects();
    const tasks = await getTasks();

    const activeProjects = projects.filter((p: any) => p.status === 'active');
    const project = activeProjects[0]; // Get first active project for overview
    const pendingTasks = tasks.filter((t: any) => t.status === 'todo').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Olá!</h1>
                    <p className="text-white/60">Aqui está o resumo do seus projetos.</p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <Folder className="h-12 w-12 text-white/20 mb-4" />
                    <h3 className="text-xl font-semibold text-white">Nenhum projeto ativo</h3>
                    <p className="text-white/50 mt-2 max-w-sm">
                        Ainda não há projetos vinculados a esta conta. Entre em contato com o suporte se acredita que isso é um erro.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Progresso Geral (Mostrando do primeiro projeto como destaque) */}
                        {project && (
                            <GlassCard className="col-span-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Progresso Atual</span>
                                    </div>
                                    <div className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                                        {project.status === 'active' ? 'Em Andamento' : project.status}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold">{project.name}</h3>
                                <p className="text-white/60 text-sm mb-6">{project.description}</p>

                                <div className="flex items-end justify-between mb-2">
                                    <span className="text-3xl font-bold">{project.progress || 0}%</span>
                                    <span className="text-white/40 text-sm">Concluído</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-primary to-purple-500 rounded-full shadow-[0_0_10px_rgba(60,130,255,0.5)] transition-all duration-1000"
                                        style={{ width: `${project.progress || 0}%` }}
                                    />
                                </div>
                                <div className="mt-4 text-right">
                                    <Link href={`/projects/${project.id}`} className="text-sm text-primary hover:text-primary/80 transition-colors">
                                        Ver Detalhes &rarr;
                                    </Link>
                                </div>
                            </GlassCard>
                        )}

                        {/* Pendências / Stats */}
                        <div className="space-y-6">
                            <GlassCard className="relative overflow-hidden border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors">
                                <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-500/20 blur-2xl" />
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle className="h-5 w-5 text-orange-400" />
                                    <h3 className="font-semibold text-orange-100">Tarefas Pendentes</h3>
                                </div>
                                <p className="text-3xl font-bold mb-2 text-white">{pendingTasks}</p>
                                <p className="text-sm text-white/60 mb-4">Itens aguardando conclusão.</p>
                                <Link href="/tasks" className="text-sm font-medium text-orange-300 hover:text-orange-200 transition-colors flex items-center gap-1">
                                    Ver Tarefas &rarr;
                                </Link>
                            </GlassCard>

                            <GlassCard>
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="rounded-lg bg-white/5 p-2">
                                        <Clock className="h-5 w-5 text-white/70" />
                                    </div>
                                    <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Projetos Ativos</span>
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{activeProjects.length}</p>
                                <p className="text-sm text-white/60">Em desenvolvimento</p>
                            </GlassCard>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
