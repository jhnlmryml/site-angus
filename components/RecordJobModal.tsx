"use client";

import React, { useEffect } from "react";
import {
    useForm,
    SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Briefcase,
    DollarSign,
    Loader2,
    User,
    X,
} from "lucide-react";
import {
    RecordJobSchema,
    RecordJobFormInputs,
} from "@/lib/schema";
import { RecordJobModalProps } from "@/lib/types";

const RecordJobModal = ({
                            isOpen,
                            isPending,
                            onClose,
                            onSubmit,
                        }: RecordJobModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RecordJobFormInputs>({
        resolver: zodResolver(RecordJobSchema),
        defaultValues: {
            customer: "",
            job: "",
            amount: undefined,
        },
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const handleFormSubmit: SubmitHandler<RecordJobFormInputs> = (
        data
    ) => {
        onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 z-50 flex h-dvh max-h-dvh items-center justify-center overflow-hidden bg-slate-950/80 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-4">
            <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-y-auto overscroll-contain rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-200 sm:max-h-[calc(100dvh-2rem)] sm:p-8">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-800 pb-3.5">
                    <h3 className="text-lg font-bold tracking-tight text-slate-100">
                        Record Finished Job
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4"
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="customer"
                            className="block text-xs font-semibold text-slate-300"
                        >
                            Customer Name
                        </label>

                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                            <input
                                id="customer"
                                type="text"
                                placeholder="e.g. John Doe"
                                {...register("customer")}
                                className="input-container"
                            />
                        </div>

                        {errors.customer && (
                            <p className="text-xs font-medium text-rose-400">
                                {errors.customer.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="job"
                            className="block text-xs font-semibold text-slate-300"
                        >
                            Job Description
                        </label>

                        <div className="relative">
                            <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                            <input
                                id="job"
                                type="text"
                                placeholder="e.g. Switchboard Upgrade"
                                {...register("job")}
                                className="input-container"
                            />
                        </div>

                        {errors.job && (
                            <p className="text-xs font-medium text-rose-400">
                                {errors.job.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="amount"
                            className="block text-xs font-semibold text-slate-300"
                        >
                            Amount
                        </label>

                        <div className="relative">
                            <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register("amount", {
                                    valueAsNumber: true,
                                })}
                                className="input-container"
                            />
                        </div>

                        {errors.amount && (
                            <p className="text-xs font-medium text-rose-400">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div className="flex shrink-0 gap-3 pt-2 sm:pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 rounded-xl border border-slate-800 bg-slate-950 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordJobModal;