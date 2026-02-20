"use client";

import Link from "next/link";
import { login } from "./actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6">
            <div className="glass-panel w-full max-w-[460px] flex flex-col items-center rounded-[22px] px-[26px] py-[28px] pb-[20px]">
                {/* Topo */}
                <div className="flex w-full flex-col items-center gap-4 text-center pb-[22px]">
                    <div className="rounded-full border border-[rgba(120,140,255,0.25)] bg-[rgba(90,110,255,0.15)] px-[14px] py-[8px] text-[13px]">
                        Motta's
                    </div>
                    <h1 className="text-[26px] leading-[1.2] font-semibold text-white">
                        Acompanhe seu projeto
                    </h1>
                    <p className="text-[14px] text-white/65">
                        Entre para visualizar o status do seu desenvolvimento.
                    </p>
                </div>

                {/* Formulario */}
                <form action={handleSubmit} className="flex w-full flex-col gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="text-[13px] text-white/70">E-mail</span>
                        <input
                            name="email"
                            type="email"
                            placeholder="nome@empresa.com"
                            required
                            className="glass-input w-full rounded-[14px] px-4 py-[14px] text-white placeholder-white/55 outline-none transition-all focus:border-[rgba(120,170,255,0.75)] focus:ring-4 focus:ring-[rgba(70,130,255,0.18)]"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] text-white/70">Senha</span>
                            <Link
                                href="#"
                                className="text-[13px] text-[rgba(120,170,255,0.95)] hover:underline"
                            >
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="glass-input w-full rounded-[14px] px-4 py-[14px] text-white placeholder-white/55 outline-none transition-all focus:border-[rgba(120,170,255,0.75)] focus:ring-4 focus:ring-[rgba(70,130,255,0.18)]"
                        />
                    </label>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-1.5 w-full cursor-pointer flex items-center justify-center rounded-full bg-linear-to-r from-[#3c82ff] to-[#506eff] px-4 py-[14px] text-[15px] font-semibold text-white shadow-[0_12px_25px_rgba(50,120,255,0.35),0_0_0_1px_rgba(255,255,255,0.08)_inset] transition-all hover:-translate-y-[2px] hover:shadow-[0_16px_35px_rgba(50,120,255,0.45),0_0_0_1px_rgba(255,255,255,0.10)_inset] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Entrar →"}
                    </button>

                    <p className="mt-1 text-center text-[13px] text-white/60">
                        Não tem uma conta?{" "}
                        <Link
                            href="#"
                            className="text-[rgba(120,170,255,0.95)] hover:underline"
                        >
                            Fale com o suporte
                        </Link>
                    </p>
                </form>

                <small className="mt-4 text-[12px] text-white/35">
                    © 2026 | Feito Por Luis Motta | Todos os Direitos Reservados
                </small>
            </div>
        </main>
    );
}
