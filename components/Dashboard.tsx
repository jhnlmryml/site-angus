"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/hooks/useAuth";
import { client } from "@/lib/supabase/client";
import RecordJobModal from "@/components/RecordJobModal";
import {
    ArrowDownLeft,
    ArrowUpRight,
    LogOut,
    Plus,
    ShieldCheck,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

const Dashboard = () => {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        moneyIn: 0,
        moneyOut: 1200,
    });

    // Fetch jobs directly from Supabase for the authenticated user
    useEffect(() => {
        if (!user?.id) return;

        let isMounted = true;

        const fetchJobs = async () => {
            setIsLoading(true);

            const { data, error } = await client
                .from("jobs")
                .select("amount")
                .eq("user_id", user.id);

            if (error) {
                console.error("Error fetching jobs:", error.message);
            } else if (data && isMounted) {
                const totalMoneyIn = data.reduce(
                    (acc, job) => acc + (Number(job.amount) || 0),
                    0
                );

                setStats((prev) => ({
                    ...prev,
                    moneyIn: totalMoneyIn,
                }));
            }

            if (isMounted) {
                setIsLoading(false);
            }
        };

        void fetchJobs();

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    const profit = stats.moneyIn - stats.moneyOut;
    const isInTheBlack = profit >= 0;

    const handleLogout = async () => {
        await client.auth.signOut();
    };

    const handleAddJob = (jobData: {
        customer: string;
        job: string;
        amount: number;
    }) => {
        if (!user) return;

        startTransition(async () => {
            setStats((prev) => ({
                ...prev,
                moneyIn: prev.moneyIn + jobData.amount,
            }));

            // Direct secure insert into Supabase
            const { error } = await client.from("jobs").insert([
                {
                    user_id: user.id,
                    customer: jobData.customer,
                    description: jobData.job,
                    amount: jobData.amount,
                },
            ]);

            if (error) {
                console.error("Error inserting job:", error.message);

                setStats((prev) => ({
                    ...prev,
                    moneyIn: prev.moneyIn - jobData.amount,
                }));
            }

            if (!error) {
                toast.add({
                    type: "success",
                    description: "Successfully added!",
                    timeout: 1000,
                });
            }

            setIsModalOpen(false);
        });
    };

    return (
        <div className="relative flex h-dvh max-h-dvh min-h-0 w-full flex-col overflow-hidden bg-slate-950 text-slate-100">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-62.5 w-125 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />
            </div>

            {/* Header */}
            <header className="relative z-40 flex h-14 min-h-14 w-full shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 backdrop-blur-md sm:h-16 sm:min-h-16 sm:px-8">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        <ShieldCheck className="h-5 w-5" />
                    </div>

                    <span className="truncate font-bold tracking-tight text-slate-100 text-[13px] sm:text-sm md:text-base">
                        Site VIP | Angus Shield
                    </span>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-3">
                    {isLoading ? (
                        <div className="flex items-center gap-3 animate-pulse">
                            <div className="hidden h-4 w-32 rounded-md bg-slate-800/80 sm:inline-block" />
                            <div className="h-8 w-8 rounded-xl bg-slate-800/80" />
                        </div>
                    ) : (
                        <>
                            <span className="hidden max-w-45 truncate text-[10px] font-medium text-slate-400 sm:inline-block sm:text-xs">
                                {user?.email}
                            </span>

                            <button
                                onClick={handleLogout}
                                type="button"
                                aria-label="Logout"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 active:scale-95"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Main Container */}
            <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col overflow-hidden px-4 py-3 sm:px-6 sm:py-5">
                <div className="min-h-0 flex-1">
                    {/* Hero Financial Metric */}
                    <div className="relative h-auto overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-md sm:p-8">
                        {isLoading ? (
                            <div className="animate-pulse space-y-5 sm:space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-36 rounded-md bg-slate-800/80" />
                                    <div className="h-5 w-24 rounded-full bg-slate-800/80" />
                                </div>

                                <div className="mt-3 sm:mt-4">
                                    <div className="h-11 w-44 rounded-xl bg-slate-800/80 sm:h-14 sm:w-48" />
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800/80" />

                                        <div className="min-w-0 space-y-2">
                                            <div className="h-3 w-16 rounded-md bg-slate-800/80" />
                                            <div className="h-5 w-20 rounded-md bg-slate-800/80" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800/80" />

                                        <div className="min-w-0 space-y-2">
                                            <div className="h-3 w-16 rounded-md bg-slate-800/80" />
                                            <div className="h-5 w-20 rounded-md bg-slate-800/80" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <span className="truncate">
                                        This Month Net Profit
                                    </span>

                                    <span
                                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                            isInTheBlack
                                                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                                : "border border-rose-500/20 bg-rose-500/10 text-rose-400"
                                        }`}
                                    >
                                        {isInTheBlack ? (
                                            <>
                                                <TrendingUp className="h-3 w-3" />
                                                In The Black
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown className="h-3 w-3" />
                                                In The Red
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="mt-3 sm:mt-4">
                                    <p
                                        className={`text-4xl font-black tracking-tight sm:text-6xl ${
                                            isInTheBlack
                                                ? "text-emerald-400"
                                                : "text-rose-400"
                                        }`}
                                    >
                                        ${profit.toLocaleString()}
                                    </p>
                                </div>

                                {/* Income Breakdown */}
                                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                            <ArrowDownLeft className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400">
                                                Money In
                                            </p>

                                            <p className="truncate text-lg font-bold text-slate-100">
                                                ${stats.moneyIn.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400">
                                                Money Out
                                            </p>

                                            <p className="truncate text-lg font-bold text-slate-100">
                                                ${stats.moneyOut.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Primary Action Target */}
                <div className="shrink-0 py-3 sm:py-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        type="button"
                        className="group relative btn"
                    >
                        <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
                        Job Done
                    </button>
                </div>
            </main>

            {/* Record Job Modal Component */}
            <RecordJobModal
                isOpen={isModalOpen}
                isPending={isPending}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddJob}
            />
        </div>
    );
};

export default Dashboard;