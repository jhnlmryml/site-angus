"use client";

import { createContext, useEffect, useState, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthContextType, AuthProviderProps } from "@/lib/types";
import { client } from "@/lib/supabase/client";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        const {
            data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const value = useMemo(() => ({ user, loading }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};










// "use client";
//
// import {
//     createContext,
//     useEffect,
//     useState,
//     useMemo,
// } from "react";
// import type { User } from "@supabase/supabase-js";;
// import {AuthContextType, AuthProviderProps} from "@/lib/types";
// import {client} from "@/lib/supabase/client";
//
//
//
// export const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export const AuthProvider = ({ children }: AuthProviderProps) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//
//     useEffect(() => {
//         let isMounted = true;
//
//         // 1. Fetch current session safely
//         client.auth
//             .getSession()
//             .then(({ data: { session }, error }) => {
//                 if (error) {
//                     console.error("Error fetching session:", error.message);
//                 }
//                 if (isMounted) {
//                     setUser(session?.user ?? null);
//                     setLoading(false);
//                 }
//             })
//             .catch((err) => {
//                 if (isMounted) {
//                     console.error("Unexpected auth error:", err);
//                     setLoading(false);
//                 }
//             });
//
//         // 2. Listen for auth state changes
//         const {
//             data: { subscription },
//         } = client.auth.onAuthStateChange((_event, session) => {
//             if (isMounted) {
//                 setUser(session?.user ?? null);
//                 setLoading(false);
//             }
//         });
//
//         // 3. Prevent state updates on unmounted components
//         return () => {
//             isMounted = false;
//             subscription.unsubscribe();
//         };
//     }, []);
//
//     // Memoize value to avoid unnecessary downstream re-renders
//     const value = useMemo(() => ({ user, loading }), [user, loading]);
//
//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
