import {type ReactNode} from "react";
import {User} from "@supabase/supabase-js";

export interface AuthContextType {
    user: User | null;
    loading: boolean;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface ActionResponse {
    error?: string;
    success?: boolean;
}
export type LoginFormInputs = {
    email: string;
    password: string;
};


export interface RecordJobModalProps {
    isOpen: boolean;
    isPending: boolean;
    onClose: () => void;
    onSubmit: (jobData: { customer: string; job: string; amount: number }) => void;
}
