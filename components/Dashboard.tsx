"use client";

import React, {useEffect, useState, useTransition} from "react";
import {useAuth} from "@/hooks/useAuth";
import {client} from "@/lib/supabase/client";
import RecordJobModal from "@/components/RecordJobModal";
import {ArrowDownLeft, ArrowUpRight, LogOut, Plus, ShieldCheck, TrendingDown, TrendingUp,} from "lucide-react";
import {toast} from "@/components/ui/toast";

const Dashboard = () => {
    const {user} = useAuth();
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
                const totalMoneyIn = data.reduce((acc, job) => acc + (Number(job.amount) || 0), 0);
                setStats((prev) => ({
                    ...prev,
                    moneyIn: totalMoneyIn,
                }));
            }

            if (isMounted) setIsLoading(false);
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

    const handleAddJob = (jobData: { customer: string; job: string; amount: number }) => {
        if (!user) return;

        startTransition(async () => {
            setStats((prev) => ({
                ...prev,
                moneyIn: prev.moneyIn + jobData.amount,
            }));

            // Direct secure insert into Supabase
            const {error} = await client.from("jobs").insert([
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
            if(!error){
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
        <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-125 h-62.5 bg-emerald-500/10 blur-[130px] rounded-full"/>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="h-5 w-5"/>
                    </div>
                    <span className="font-bold tracking-tight text-slate-100 text-[13px] sm:text-sm md:text-base">
                        Site VIP | Angus Shield
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {isLoading ? (

                        <div className="flex items-center gap-3 animate-pulse">
                            <div className="hidden h-4 w-32 rounded-md bg-slate-800/80 sm:inline-block"/>
                            <div className="h-8 w-8 rounded-xl bg-slate-800/80"/>
                        </div>

                    ) : (

                        <>
                            <span className="hidden text-[10px] sm:text-xs font-medium text-slate-400 sm:inline-block max-w-45 truncate">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                type="button"
                                aria-label="Logout"
                                className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 active:scale-95"
                            >
                                <LogOut className="h-4 w-4"/>
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Main Container */}
            <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-between p-4 sm:p-6">
                <div className="space-y-6">
                    {/* Hero Financial Metric */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">

                        {isLoading ? (
                            <div className="animate-pulse space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-36 rounded-md bg-slate-800/80"/>
                                    <div className="h-5 w-24 rounded-full bg-slate-800/80"/>
                                </div>

                                <div className="mt-4">
                                    <div className="h-12 w-48 rounded-xl bg-slate-800/80 sm:h-14"/>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-800/80"/>
                                        <div className="space-y-2">
                                            <div className="h-3 w-16 rounded-md bg-slate-800/80"/>
                                            <div className="h-5 w-20 rounded-md bg-slate-800/80"/>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-800/80"/>
                                        <div className="space-y-2">
                                            <div className="h-3 w-16 rounded-md bg-slate-800/80"/>
                                            <div className="h-5 w-20 rounded-md bg-slate-800/80"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <span>This Month Net Profit</span>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                            isInTheBlack
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        }`}
                                    >
                                        {isInTheBlack ? (
                                            <>
                                                <TrendingUp className="h-3 w-3"/>
                                                In The Black
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown className="h-3 w-3"/>
                                                In The Red
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <p
                                        className={`text-5xl font-black tracking-tight sm:text-6xl ${
                                            isInTheBlack ? "text-emerald-400" : "text-rose-400"
                                        }`}
                                    >
                                        ${profit.toLocaleString()}
                                    </p>
                                </div>

                                {/* Income Breakdown */}
                                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <ArrowDownLeft className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Money In</p>
                                            <p className="text-lg font-bold text-slate-100">
                                                ${stats.moneyIn.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                            <ArrowUpRight className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Money Out</p>
                                            <p className="text-lg font-bold text-slate-100">
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
                <div className="py-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        type="button"
                        className="group relative btn"
                    >
                        <Plus className="h-5 w-5 transition-transform group-hover:scale-110"/>
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