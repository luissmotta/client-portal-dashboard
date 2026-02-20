"use client";

import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, MessageSquare, Layout, Image as ImageIcon, Palette, Type, Check, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitFeedback, approvePage } from "@/app/actions/feedback";

const sections = [
    { id: "copy", title: "Copywriting", icon: Type, desc: "Tom de voz, clareza e gramática." },
    { id: "structure", title: "Estrutura & Layout", icon: Layout, desc: "Fluxo da página e hierarquia." },
    { id: "images", title: "Imagens", icon: ImageIcon, desc: "Qualidade e relevância das fotos." },
    { id: "design", title: "Visual Design", icon: Palette, desc: "Cores, tipografia e espaçamento." },
];

interface PageValidationClientProps {
    page: any;
    projectId: string;
}

export default function PageValidationClient({ page, projectId }: PageValidationClientProps) {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Record<string, string>>({});
    const [flagged, setFlagged] = useState<Record<string, boolean>>({});
    const [isPending, startTransition] = useTransition();

    const toggleFlag = (id: string) => {
        setFlagged(prev => ({ ...prev, [id]: !prev[id] }));
        if (activeTab === id) setActiveTab(null);
        else setActiveTab(id);
    };

    const handleSubmitAdjustments = () => {
        const items = Object.entries(feedback)
            .filter(([key, value]) => flagged[key] && value.trim().length > 0)
            .map(([category, content]) => ({ category, content }));

        if (items.length === 0) {
            alert("Por favor, descreva os ajustes necessários nos itens marcados.");
            return;
        }

        startTransition(async () => {
            const result = await submitFeedback(page.id, items);
            if (result.success) {
                alert("Feedback enviado com sucesso!");
                setFeedback({});
                setFlagged({});
            } else {
                alert("Erro ao enviar feedback.");
            }
        });
    };

    const handleApprove = () => {
        if (!confirm("Tem certeza que deseja aprovar esta página?")) return;

        startTransition(async () => {
            const result = await approvePage(page.id);
            if (result.success) {
                alert("Página aprovada!");
            } else {
                alert("Erro ao aprovar página.");
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/projects/${projectId}`} className="rounded-full bg-white/5 p-2 hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-white/70" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                                page.status === 'approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    page.status === 'changes_requested' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            )}>
                                {page.status === 'approved' ? 'Aprovado' : page.status === 'changes_requested' ? 'Ajustes Solicitados' : 'Em Revisão'}
                            </span>
                            <span className="text-xs text-white/40">Atualizado em {new Date(page.last_updated || page.created_at).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-white">{page.name} - Validação</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right mr-4 hidden md:block">
                        <p className="text-xs text-white/40 uppercase font-bold">URL</p>
                        <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{page.url || "N/A"}</a>
                    </div>
                </div>
            </div>

            <p className="text-white/60 max-w-2xl">
                Revise as seções abaixo. Marque a caixa para solicitar ajustes ou aprove a página se tudo estiver correto.
            </p>

            <div className="space-y-4">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isFlagged = flagged[section.id];

                    return (
                        <GlassCard
                            key={section.id}
                            className={cn(
                                "transition-all duration-300 border-l-4",
                                isFlagged ? "border-l-red-500 bg-red-500/2" : "border-l-transparent hover:border-l-white/20"
                            )}
                        >
                            <div className="flex items-start md:items-center gap-4">
                                <div className={cn("rounded-xl p-3 bg-white/5 text-white/70", isFlagged && "text-red-400 ring-2 ring-red-500/20")}>
                                    <Icon className="h-6 w-6" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-white">{section.title}</h3>
                                    <p className="text-sm text-white/50">{section.desc}</p>
                                </div>

                                <button
                                    onClick={() => toggleFlag(section.id)}
                                    className={cn(
                                        "flex h-8 w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                                        isFlagged
                                            ? "bg-red-500/10 border-red-500/50 text-red-400"
                                            : "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10"
                                    )}
                                >
                                    {isFlagged ? (
                                        <>
                                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                            Requer Ajuste
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-3 w-3" />
                                            Aprovado
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Area de Feedback Condicional */}
                            {isFlagged && (
                                <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-2 fade-in duration-300">
                                    <label className="mb-2 block text-sm font-medium text-white/80">
                                        Descreva o ajuste necessário:
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white text-sm outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 min-h-[100px] resize-none"
                                        placeholder={`Ex: O texto da seção ${section.title} está muito longo...`}
                                        value={feedback[section.id] || ""}
                                        onChange={(e) => setFeedback(prev => ({ ...prev, [section.id]: e.target.value }))}
                                    />
                                </div>
                            )}
                        </GlassCard>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-6 z-20">
                <GlassCard className="flex items-center justify-between shadow-2xl shadow-black/50 border-white/10 py-4">
                    <div className="hidden md:block">
                        <p className="text-xs text-white/40 font-bold uppercase">Ações</p>
                        <p className="text-sm font-medium text-white">Escolha uma ação para esta página</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {Object.values(flagged).some(Boolean) ? (
                            <button
                                onClick={handleSubmitAdjustments}
                                disabled={isPending}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Enviar Ajustes
                            </button>
                        ) : (
                            <button
                                onClick={handleApprove}
                                disabled={isPending}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Aprovar Página
                            </button>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
