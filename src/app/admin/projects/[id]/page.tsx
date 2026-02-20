import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, ExternalLink } from "lucide-react";
import { getProjectById } from "@/app/actions/projects";
import { getProjectPages } from "@/app/actions/pages";
import { createPage, deletePage } from "@/app/actions/admin-pages";
import { CreatePageForm } from "@/components/features/admin/create-page-form";

export default async function AdminProjectDetails(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const project = await getProjectById(params.id);
    const pages = await getProjectPages(params.id);

    if (!project) {
        return <div className="text-white">Projeto não encontrado.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="rounded-full bg-white/5 p-2 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-white/70" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
                    <p className="text-white/50 text-sm">Gerencie as páginas e o progresso deste projeto.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Add Page Form */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Adicionar Página</h2>
                    <GlassCard className="p-6">
                        <CreatePageForm projectId={project.id} />
                    </GlassCard>
                </div>

                {/* Pages List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Páginas Cadastradas</h2>
                    <div className="space-y-3">
                        {pages.length === 0 ? (
                            <p className="text-white/40 text-sm">Nenhuma página cadastrada ainda.</p>
                        ) : (
                            pages.map((page: any) => (
                                <GlassCard key={page.id} className="p-4 flex items-center justify-between group">
                                    <div>
                                        <p className="font-medium text-white">{page.name}</p>
                                        <a href={page.url} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                                            {page.url} <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/60 capitalize">
                                            {page.status.replace('_', ' ')}
                                        </span>
                                        <form action={deletePage}>
                                            <input type="hidden" name="page_id" value={page.id} />
                                            <input type="hidden" name="project_id" value={project.id} />
                                            <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>
                                </GlassCard>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
