"use client";

import { Loader2, Plus } from "lucide-react";
import { createPage } from "@/app/actions/admin-pages";
import { useState, useTransition, useRef } from "react";

export function CreatePageForm({ projectId }: { projectId: string }) {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            await createPage(formData);
            formRef.current?.reset();
        });
    };

    return (
        <form ref={formRef} action={handleSubmit} className="space-y-4">
            <input type="hidden" name="project_id" value={projectId} />

            <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Nome da Página</label>
                <input
                    name="name"
                    required
                    placeholder="Ex: Home, Sobre, Contato"
                    className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">URL Completa</label>
                <input
                    name="url"
                    required
                    placeholder="https://seu-site.com/home"
                    className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/80 px-4 py-3 text-sm font-semibold text-white hover:bg-primary shadow-lg transition-all disabled:opacity-50"
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Adicionar Página
            </button>
        </form>
    );
}
