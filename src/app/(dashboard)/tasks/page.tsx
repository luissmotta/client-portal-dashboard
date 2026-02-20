import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle2, Circle, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTasks } from "@/app/actions/tasks";

export const revalidate = 0;

const statusConfig = {
    done: { label: "Concluído", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 },
    in_progress: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock },
    todo: { label: "Pendente", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Circle },
};

export default async function TasksPage() {
    const tasks = await getTasks();

    // Calculate stats
    const total = tasks.length;
    const completed = tasks.filter((t: any) => t.status === "done").length;
    const inProgress = tasks.filter((t: any) => t.status === "in_progress").length;
    const pending = tasks.filter((t: any) => t.status === "todo").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Tarefas do Projeto</h1>
                    <p className="text-white/50 text-sm">Acompanhe o andamento das atividades.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                    <Filter className="h-4 w-4" />
                    Filtrar
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4 mb-2">
                <GlassCard className="p-4 flex flex-col items-start gap-1">
                    <span className="text-xs text-white/40 font-bold uppercase">Total</span>
                    <span className="text-2xl font-bold">{total}</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-start gap-1 border-emerald-500/20 bg-emerald-500/5">
                    <span className="text-xs text-emerald-400 font-bold uppercase">Concluídas</span>
                    <span className="text-2xl font-bold text-white">{completed}</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-start gap-1 border-blue-500/20 bg-blue-500/5">
                    <span className="text-xs text-blue-400 font-bold uppercase">Em Andamento</span>
                    <span className="text-2xl font-bold text-white">{inProgress}</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-start gap-1 border-amber-500/20 bg-amber-500/5">
                    <span className="text-xs text-amber-400 font-bold uppercase">Pendentes</span>
                    <span className="text-2xl font-bold text-white">{pending}</span>
                </GlassCard>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-[#050a1a]/50 overflow-hidden backdrop-blur-md">
                <div className="grid grid-cols-12 gap-4 border-b border-white/10 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                    <div className="col-span-6 md:col-span-5">Nome da Tarefa</div>
                    <div className="col-span-3 text-center">Status</div>
                    <div className="hidden md:block md:col-span-2">Responsável</div>
                    <div className="col-span-3 md:col-span-2 text-right">Data</div>
                </div>

                <div className="divide-y divide-white/5">
                    {tasks.length === 0 ? (
                        <div className="p-6 text-center text-white/50">Nenhuma tarefa encontrada.</div>
                    ) : (
                        tasks.map((task: any) => {
                            const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.todo;
                            const Icon = status.icon;

                            return (
                                <div key={task.id} className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-white/2">
                                    <div className="col-span-6 md:col-span-5">
                                        <p className="font-medium text-white">{task.title}</p>
                                    </div>

                                    <div className="col-span-3 flex justify-center">
                                        <div className={cn("hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border", status.bg, status.color, status.border)}>
                                            <Icon className="h-3.5 w-3.5" />
                                            {status.label}
                                        </div>
                                        <div className={cn("md:hidden flex h-6 w-6 items-center justify-center rounded-full border", status.bg, status.color, status.border)}>
                                            <Icon className="h-3.5 w-3.5" />
                                        </div>
                                    </div>

                                    <div className="hidden md:block md:col-span-2 text-sm text-white/70">
                                        {task.assignee}
                                    </div>

                                    <div className="col-span-3 md:col-span-2 text-right text-sm text-white/60">
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '-'}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
