"use client";

import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { createProject } from "@/app/actions/admin";
import { useState, useTransition } from "react";

export default function NewProjectPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await createProject(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="rounded-full bg-white/5 p-2 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-white/70" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-white">Novo Projeto</h1>
                    <p className="text-white/50 text-sm">Cadastre um novo projeto para um cliente.</p>
                </div>
            </div>

            <GlassCard className="p-8">
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Nome do Projeto</label>
                        <input
                            name="name"
                            required
                            placeholder="Ex: Redesign Site Institucional"
                            className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Descrição</label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Breve descrição do escopo..."
                            className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">E-mail do Cliente (Opcional)</label>
                            <input
                                type="email"
                                name="client_email"
                                placeholder="cliente@empresa.com"
                                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Prazo de Entrega</label>
                            <input
                                type="date"
                                name="deadline"
                                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Tipo de Projeto</label>
                            <select
                                name="project_type"
                                required
                                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 [&>option]:bg-[#050a1a]"
                            >
                                <option value="landing_page">Landing Page</option>
                                <option value="institutional">Site Institucional</option>
                                <option value="ecommerce">E-commerce</option>
                                <option value="other">Outro</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Dev Responsável</label>
                            <select
                                name="responsible_dev"
                                required
                                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 [&>option]:bg-[#050a1a]"
                            >
                                <option value="Luis Motta">Luis Motta</option>
                                <option value="Eduarda Almeida">Eduarda Almeida</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Criar Projeto
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
