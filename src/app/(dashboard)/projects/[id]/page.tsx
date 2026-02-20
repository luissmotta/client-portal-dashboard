import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProjectById } from "@/app/actions/projects";
import { getProjectPages } from "@/app/actions/pages";

export const revalidate = 0;

const statusConfig = {
    approved: { label: "Aprovado", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 },
    in_progress: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock },
    changes_requested: { label: "Ajustes Necessários", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertCircle },
    pending_review: { label: "Pendente", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
};

export default async function ProjectDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const defaultProject = { name: "Carregando Projeto...", description: "..." };

    // Safety check for params
    if (!params?.id) return <div>ID do projeto não encontrado.</div>;

    const project = await getProjectById(params.id) || defaultProject;
    const pages = await getProjectPages(params.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/projects" className="rounded-full bg-white/5 p-2 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-white/70" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
                    <p className="text-white/50 text-sm">{project.description || "Gerencie a estrutura e o status das páginas."}</p>
                </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-[#050a1a]/50 overflow-hidden backdrop-blur-md">
                {/* Header da Tabela */}
                <div className="grid grid-cols-12 gap-4 border-b border-white/10 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                    <div className="col-span-12 md:col-span-4">Nome da Página</div>
                    <div className="hidden md:block md:col-span-3 text-center">Status</div>
                    <div className="hidden md:block md:col-span-3">Última Atualização</div>
                    {/* <div className="col-span-3 md:col-span-2 text-right">Ações</div> */}
                </div>

                <div className="divide-y divide-white/5">
                    {pages.length === 0 ? (
                        <div className="p-6 text-center text-white/50">Nenhuma página encontrada para este projeto.</div>
                    ) : (
                        pages.map((page: any) => {
                            const status = statusConfig[page.status as keyof typeof statusConfig] || statusConfig.pending_review;
                            const Icon = status.icon;

                            return (
                                <Link
                                    key={page.id}
                                    href={`/projects/${params.id}/pages/${page.id}`}
                                    className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-white/2 cursor-pointer group"
                                >
                                    {/* Nome */}
                                    <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                                        <div className="rounded-lg bg-white/5 p-2 text-white/50 group-hover:text-white transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white group-hover:text-primary transition-colors">{page.name}</p>
                                            <p className="text-xs text-white/40">{page.url || "Sem URL"}</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="hidden md:flex md:col-span-3 justify-center">
                                        <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border", status.bg, status.color, status.border)}>
                                            <Icon className="h-3.5 w-3.5" />
                                            {status.label}
                                        </div>
                                    </div>

                                    {/* Update */}
                                    <div className="hidden md:flex md:col-span-3 items-center text-sm text-white/60">
                                        <Clock className="mr-2 h-4 w-4 text-white/30" />
                                        {new Date(page.last_updated || page.created_at).toLocaleDateString()}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-12 md:col-span-2 flex justify-end">
                                        <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver detalhes &rarr;
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
