"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, Lock, Mail } from "lucide-react";
import { client } from "@/lib/supabase/client";
import { LoginFormInputs } from "@/lib/types";
import { LoginSchema } from "@/lib/schema";
import { toast } from "@/components/ui/toast";

const LoginCard = () => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: process.env.NEXT_PUBLIC_EMAIL || "tradie@sitevip.com",
            password: process.env.NEXT_PUBLIC_PASSWORD || "password123",
        },
    });

    const onSubmit = async ({ email, password }: LoginFormInputs) => {
        setLoading(true);
        try {
            const { error } = await client.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.add({
                    type: "error",
                    description: error.message,
                    timeout: 1500,
                });
            }
        } catch {
            toast.add({
                type: "error",
                description: "An unexpected error occurred. Please try again.",
                timeout: 1500,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm sm:max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-100">
                    Site VIP | Angus Shield
                </h1>
                <p className="text-xs text-slate-400 max-w-xs">
                    One login to replace 6+ systems. Keep your business in the black.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            id="email"
                            type="email"
                            readOnly
                            placeholder="tradie@sitevip.com"
                            {...register("email")}
                            className="input-container"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs font-medium text-rose-400">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            readOnly
                            {...register("password")}
                            className="input-container"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-xs font-medium text-rose-400">{errors.password.message}</p>
                    )}
                </div>

                <button type="submit" disabled={loading} className="btn mt-2">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                </button>
            </form>
        </div>
    );
};

export default LoginCard;