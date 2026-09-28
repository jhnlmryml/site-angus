"use client";

import React from "react";
import LoginCard from "@/components/LoginCard";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-dvh max-h-dvh w-full items-center justify-center overflow-hidden bg-[#020617]">
                <div className="relative flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <main className="flex h-dvh max-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#020617]">
            {user ? <Dashboard /> : <LoginCard />}
        </main>
    );
}